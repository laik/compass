import { autobind } from "../../utils";
import { KubeObject } from "../kube-object";
import { KubeApi } from "../kube-api";
import { apiWorkloads } from "../index";

@autobind()
export class StorageClass extends KubeObject {
  static kind = "StorageClass"

  provisioner: string; // e.g. "storage.k8s.io/v1"
  mountOptions?: string[];
  volumeBindingMode: string;
  reclaimPolicy: string;
  parameters: {
    [param: string]: string; // every provisioner has own set of these parameters
  }

  isDefault() {
    const annotations = this.metadata.annotations || {};
    return (
      annotations["storageclass.kubernetes.io/is-default-class"] === "true" ||
      annotations["storageclass.beta.kubernetes.io/is-default-class"] === "true"
    )
  }

  getVolumeBindingMode() {
    return this.volumeBindingMode || "-"
  }

  getReclaimPolicy() {
    return this.reclaimPolicy || "-"
  }
}

export const storageClassApi = new KubeApi({
  kind: StorageClass.kind,
  apiBase: "/apis/storage.k8s.io/v1/storageclasses",
  isNamespaced: false,
  objectConstructor: StorageClass,
  request: apiWorkloads,
});
