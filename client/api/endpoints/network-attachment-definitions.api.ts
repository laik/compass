import {autobind} from "../../utils";
import {KubeObject} from "../kube-object";
import {KubeApi} from "../kube-api";

export interface IPAM {
  type: string,
  gateway?: string,
  subnet?: string,
  rangeStart?: string,
  rangeEnd?: string,
  routes?: {
    [key: string]: string
  }[]
}

export interface NetworkAttachmentDefinitionConfig {
  cniVersion: string,
  type: string,
  name: string,
  master: string,
  mode: string,
  ipam?: IPAM
}

export const networkAttachmentDefinitionConfig: NetworkAttachmentDefinitionConfig = {
  cniVersion: "0.3.0",
  type: "macvlan",
  name: "",
  master: "",
  mode: "bridge"
}

export const ipam: IPAM = {
  type: "host-local"
}

@autobind()
export class NetworkAttachmentDefinition extends KubeObject {
  static kind = "NetworkAttachmentDefinition";

  spec: {
    config: string
  }

  getConfig(): NetworkAttachmentDefinitionConfig {
    try {
      return JSON.parse(this.spec.config)
    } catch {
      return networkAttachmentDefinitionConfig
    }
  }
}

export const networkAttachmentDefinitionApi = new KubeApi({
  kind: NetworkAttachmentDefinition.kind,
  apiBase: "/apis/k8s.cni.cncf.io/v1/network-attachment-definitions",
  isNamespaced: false,
  objectConstructor: NetworkAttachmentDefinition,
});