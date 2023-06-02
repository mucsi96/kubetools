# kubetools
Tools for Kubernetes cluster

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