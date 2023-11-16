#!/bin/bash

export KUBECONFIG=~/.kube/ansible-config

# ansible-playbook \
#     playbooks/enable_root_login.yaml \
#     playbooks/new_ssh_user.yaml \
#     playbooks/ssh_hardening.yaml \
#     playbooks/update_packages.yaml \
#     playbooks/install_kubernetes.yaml \
#     playbooks/deploy_kubernetes_sso_portal.yaml \
#     playbooks/deploy_cloudflare_tunnel.yaml \
#     playbooks/deploy_kubernetes_monitoring.yaml \
#     playbooks/deploy_kubernetes_demo.yaml


ansible-playbook \
    playbooks/deploy_cloudflare_tunnel.yaml \
    playbooks/deploy_kubernetes_monitoring.yaml \
    playbooks/deploy_kubernetes_demo.yaml

# ansible-playbook \
#     playbooks/pull_kube_configs.yaml
