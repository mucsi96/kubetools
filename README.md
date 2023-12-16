# kubetools
Tools for Kubernetes cluster

Tested on:
- Rocky Linux 8
- Ubuntu 22.04 (arm64)
- Debian 12

### Remove namespace "stuck" as Terminating

```bash
kubectl get namespace "training-log-pro" -o json \
  | tr -d "\n" | sed "s/\"finalizers\": \[[^]]\+\]/\"finalizers\": []/" \
  | kubectl replace --raw /api/v1/namespaces/training-log-pro/finalize -f -
```

### Spin up curl pod on demand

```bash
kubectl run curl -it --rm --image=curlimages/curl -- sh
```

### List containers on K3S

```bash
sudo k3s crictl ps
```

### List images on K3S

```bash
sudo k3s crictl images
```

### Remove db data

First Remove DB deployment

```bash
sudo rm -rf /var/lib/rancher/k3s/storage
sudo k3s crictl rmi postgres:15
```