---
title: Build a Python application that uses YSQL and psycopg2
headerTitle: Build a Python application
linkTitle: Python
description: Build a sample Python application with psycopg2 that use YSQL.
menu:
  v2.4:
    parent: build-apps
    name: Python
    identifier: python-1
    weight: 553
type: docs
---

<ul class="nav nav-tabs-alt nav-tabs-yb">
  <li >
    <a href="" class="nav-link active">
      <i class="icon-postgres" aria-hidden="true"></i>
      YSQL - psycopg2
    </a>
  </li>
  <li >
    <a href="{{< relref "./ysql-aiopg.md" >}}" class="nav-link">
      <i class="icon-postgres" aria-hidden="true"></i>
      YSQL - aiopg
    </a>
  </li>
  <li >
    <a href="{{< relref "./ysql-sqlalchemy.md" >}}" class="nav-link">
      <i class="icon-postgres" aria-hidden="true"></i>
      YSQL - SQL Alchemy
    </a>
  </li>
  <li>
    <a href="{{< relref "./ycql.md" >}}" class="nav-link">
      <i class="icon-cassandra" aria-hidden="true"></i>
      YCQL
    </a>
  </li>
</ul>

The following tutorial creates a simple Python application that connects to a YugabyteDB cluster using the `psycopg2` database adapter, performs a few basic database operations — creating a table, inserting data, and running a SQL query — and prints the results to the screen.

## Before you begin

This tutorial assumes that you have satisfied the following prerequisites.

### YugabyteDB

YugabyteDB is up and running. If you are new to YugabyteDB, you can have YugabyteDB up and running within five minutes by following the steps in [Quick start](../../../../quick-start/).

### Python

Python 3, or later, is installed.

### psycopg2 database adapter

[Psycopg](http://initd.org/psycopg/),the popular PostgreSQL database adapter for Python, is installed. To install a binary version of `psycopg2`, run the following `pip3` command.

```sh
$ pip3 install psycopg2-binary
```

For details about using this database adapter, see [Psycopg documentation](http://initd.org/psycopg/docs/).

## Create the sample Python application

Create a file `yb-sql-helloworld.py` and add the following content to it.

```python
import psycopg2

# Create the database connection.

conn = psycopg2.connect("host=127.0.0.1 port=5433 dbname=yugabyte user=yugabyte password=yugabyte")

# Open a cursor to perform database operations.
# The default mode for psycopg2 is "autocommit=false".

conn.set_session(autocommit=True)
cur = conn.cursor()

# Create the table. (It might preexist.)

cur.execute(
  """
  DROP TABLE IF EXISTS employee
  """)

cur.execute(
  """
  CREATE TABLE employee (id int PRIMARY KEY,
                         name varchar,
                         age int,
                         language varchar)
  """)
print("Created table employee")
cur.close()

# Take advantage of ordinary, transactional behavior for DMLs.

conn.set_session(autocommit=False)
cur = conn.cursor()

# Insert a row.

cur.execute("INSERT INTO employee (id, name, age, language) VALUES (%s, %s, %s, %s)",
            (1, 'John', 35, 'Python'))
print("Inserted (id, name, age, language) = (1, 'John', 35, 'Python')")

# Query the row.

cur.execute("SELECT name, age, language FROM employee WHERE id = 1")
row = cur.fetchone()
print("Query returned: %s, %s, %s" % (row[0], row[1], row[2]))

# Commit and close down.

conn.commit()
cur.close()
conn.close()
```

### Run the application

To use the application, run the following Python script you just created.

```sh
$ python yb-sql-helloworld.py
```

You should see the following output.

```
Created table employee
Inserted (id, name, age, language) = (1, 'John', 35, 'Python')
Query returned: John, 35, Python
```
