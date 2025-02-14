#!/usr/bin/env python
#
# Copyright 2019 YugaByte, Inc. and Contributors
#
# Licensed under the Polyform Free Trial License 1.0.0 (the "License"); you
# may not use this file except in compliance with the License. You
# may obtain a copy of the License at
#
# https://github.com/YugaByte/yugabyte-db/blob/master/licenses/POLYFORM-FREE-TRIAL-LICENSE-1.0.0.txt


import logging
import time

from ybops.common.exceptions import YBOpsRuntimeError
from fabric import Connection
from paramiko.ssh_exception import NoValidConnectionsError

CONNECTION_ATTEMPTS = 5
CONNECTION_ATTEMPT_DELAY_SEC = 3


def retry_network_errors(command):
    attempt = 0
    while True:
        try:
            result = command()
            return result
        except NoValidConnectionsError as e:
            attempt += 1
            logging.warning("Connection attempt {} failed: {}".format(attempt, e.errors))
            if attempt >= CONNECTION_ATTEMPTS:
                raise e
            time.sleep(CONNECTION_ATTEMPT_DELAY_SEC)


class RemoteShell(object):
    """RemoteShell class is used run remote shell commands against nodes using fabric.
    """

    def __init__(self, options):
        assert options["ssh_user"] is not None, 'ssh_user is required option'
        assert options["ssh_host"] is not None, 'ssh_host is required option'
        assert options["ssh_port"] is not None, 'ssh_port is required option'
        assert options["private_key_file"] is not None, 'private_key_file is required option'

        self.ssh_conn = Connection(
            host=options.get("ssh_host"),
            user=options.get("ssh_user"),
            port=options.get("ssh_port"),
            connect_kwargs={'key_filename': [options.get("private_key_file")]}
        )

    def run_command_raw(self, command):
        return retry_network_errors(lambda: self.ssh_conn.run(command, hide=True, warn=True))

    def run_command(self, command):
        result = self.run_command_raw(command)

        if result.exited:
            raise YBOpsRuntimeError(
                "Remote shell command '{}' failed with "
                "return code '{}' and error '{}'".format(command.encode('utf-8'),
                                                         result.stderr.encode('utf-8'),
                                                         result.exited)
            )

        return result

    def put_file(self, local_path, remote_path):
        return retry_network_errors(lambda: self.ssh_conn.put(local_path, remote_path))

    # Checks if the file exists on the remote, and if not, it puts it there.
    def put_file_if_not_exists(self, local_path, remote_path, file_name):
        result = self.run_command('ls ' + remote_path)
        if file_name not in result.stdout:
            self.put_file(local_path, os.path.join(remote_path, file_name))
