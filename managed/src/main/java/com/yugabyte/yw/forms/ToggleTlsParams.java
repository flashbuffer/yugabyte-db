// Copyright (c) YugaByte, Inc.

package com.yugabyte.yw.forms;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.yugabyte.yw.common.PlatformServiceException;
import com.yugabyte.yw.forms.PlatformResults.YBPError;
import com.yugabyte.yw.models.CertificateInfo;
import java.util.UUID;
import play.data.validation.Constraints;
import play.mvc.Http;

/** Class to capture request params for toggle_tls API */
public class ToggleTlsParams {
  public UpgradeParams.UpgradeOption upgradeOption = UpgradeParams.UpgradeOption.ROLLING_UPGRADE;

  @Constraints.Required() public boolean enableNodeToNodeEncrypt;

  @Constraints.Required() public boolean enableClientToNodeEncrypt;

  public UUID rootCA = null;

  public UUID clientRootCA = null;

  public Boolean rootAndClientRootCASame = null;

  // Verifies the ToggleTlsParams by comparing with the existing
  // UniverseDefinitionTaskParams, returns YWError object if invalid else null
  public YBPError verifyParams(UniverseDefinitionTaskParams universeParams) {
    boolean existingEnableClientToNodeEncrypt =
        universeParams.getPrimaryCluster().userIntent.enableClientToNodeEncrypt;
    boolean existingEnableNodeToNodeEncrypt =
        universeParams.getPrimaryCluster().userIntent.enableNodeToNodeEncrypt;
    UUID existingRootCA = universeParams.rootCA;
    UUID existingClientRootCA = universeParams.clientRootCA;

    if (upgradeOption != UpgradeParams.UpgradeOption.ROLLING_UPGRADE
        && upgradeOption != UpgradeParams.UpgradeOption.NON_ROLLING_UPGRADE) {
      return new YBPError("TLS upgrade can be performed either rolling or non-rolling way.");
    }

    if (this.enableClientToNodeEncrypt == existingEnableClientToNodeEncrypt
        && this.enableNodeToNodeEncrypt == existingEnableNodeToNodeEncrypt) {
      return new YBPError("No changes in Tls parameters, cannot perform update operation.");
    }

    if (rootCA != null && CertificateInfo.get(rootCA) == null) {
      return new YBPError("No valid rootCA found for UUID: " + rootCA);
    }

    if (existingRootCA != null && rootCA != null && !existingRootCA.equals(rootCA)) {
      return new YBPError("Cannot update root certificate, if already created.");
    }

    if (existingClientRootCA != null
        && clientRootCA != null
        && !existingClientRootCA.equals(clientRootCA)) {
      return new YBPError("Cannot update client root certificate, if already created.");
    }

    return null;
  }

  public static ToggleTlsParams bindFromFormData(ObjectNode formData) {
    ToggleTlsParams params = new ToggleTlsParams();
    JsonNode upgradeOption = formData.get("upgradeOption");
    JsonNode nodeToNode = formData.get("enableNodeToNodeEncrypt");
    JsonNode clientToNode = formData.get("enableClientToNodeEncrypt");
    JsonNode rootCA = formData.get("rootCA");
    JsonNode clientRootCA = formData.get("clientRootCA");
    JsonNode rootAndClientRootCASame = formData.get("rootAndClientRootCASame");

    if (upgradeOption != null && upgradeOption.isTextual() && !upgradeOption.asText().isEmpty()) {
      try {
        params.upgradeOption = UpgradeParams.UpgradeOption.valueOf(upgradeOption.asText());
      } catch (IllegalArgumentException e) {
        throw new PlatformServiceException(
            Http.Status.BAD_REQUEST, "upgradeOption: Invalid upgrade option.");
      }
    }

    if (nodeToNode != null && nodeToNode.isBoolean()) {
      params.enableNodeToNodeEncrypt = nodeToNode.asBoolean();
    } else {
      throw new PlatformServiceException(
          Http.Status.BAD_REQUEST, "enableNodeToNodeEncrypt: This field is required.");
    }

    if (clientToNode != null && clientToNode.isBoolean()) {
      params.enableClientToNodeEncrypt = clientToNode.asBoolean();
    } else {
      throw new PlatformServiceException(
          Http.Status.BAD_REQUEST, "enableClientToNodeEncrypt: This field is required.");
    }

    if (rootCA != null && rootCA.isTextual() && !rootCA.asText().isEmpty()) {
      try {
        params.rootCA = UUID.fromString(rootCA.asText());
      } catch (IllegalArgumentException e) {
        throw new PlatformServiceException(Http.Status.BAD_REQUEST, "rootCA: Invalid Uuid String.");
      }
    }

    if (clientRootCA != null && clientRootCA.isTextual() && !clientRootCA.asText().isEmpty()) {
      try {
        params.clientRootCA = UUID.fromString(clientRootCA.asText());
      } catch (IllegalArgumentException e) {
        throw new PlatformServiceException(
            Http.Status.BAD_REQUEST, "clientRootCA: Invalid Uuid String.");
      }
    }

    if (rootAndClientRootCASame != null && rootAndClientRootCASame.isBoolean()) {
      try {
        params.rootAndClientRootCASame = rootAndClientRootCASame.asBoolean();
      } catch (IllegalArgumentException e) {
        throw new PlatformServiceException(
            Http.Status.BAD_REQUEST, "rootAndClientRootCASame: Invalid Boolean.");
      }
    }

    return params;
  }
}
