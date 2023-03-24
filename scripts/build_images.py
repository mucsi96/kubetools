#!/usr/bin/env python3

from pathlib import Path
import sys
root_directory = Path(__file__).parent.parent

sys.path.append(str(root_directory))

from lib.docker_utils import build_and_push_client_img, build_and_push_server_img
from lib.ansible_utils import load_vars

data = load_vars(root_directory / '.ansible/vault_key', root_directory / 'vars/vault.yaml')
docker_username = data['docker_username']
docker_password = data['docker_password']

build_and_push_client_img(
    src=root_directory / 'demo_app/client',
    tag_prefix='demo-app-client',
    image_name='mucsi96/kubetools-demo-app-client',
    docker_username=docker_username,
    docker_password=docker_password
)

build_and_push_server_img(
    src=root_directory / 'demo_app/server',
    tag_prefix='demo-app-server',
    image_name='mucsi96/kubetools-demo-app-server',
    docker_username=docker_username,
    docker_password=docker_password
)

build_and_push_server_img(
    src=root_directory / 'spring-boot-admin',
    tag_prefix='spring-boot-admin',
    image_name='mucsi96/kubetools-spring-boot-admin',
    docker_username=docker_username,
    docker_password=docker_password
)