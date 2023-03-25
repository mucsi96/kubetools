
from subprocess import run
from pathlib import Path
import sys
from typing import List
from lib.github_utils import create_release
from lib.version_utils import get_version


def build_and_push_client_img(
    *,
    src: Path,
    tag_prefix: str,
    image_name: str,
    docker_username: str,
    docker_password: str,
    github_access_token: str,
    pack_args: List[str] = [],
    ignore: List[str] = [],
):
    build_and_push_img(
        src=src,
        tag_prefix=tag_prefix,
        image_name=image_name,
        pack_args=[
            '--builder',   'paketobuildpacks/builder:base',
            '--buildpack', 'paketo-buildpacks/web-servers',
            '--buildpack', 'paketo-buildpacks/source-removal',
            '--env',       'BP_NODE_RUN_SCRIPTS=build',
            '--env',       'BP_WEB_SERVER_ROOT=dist',
            '--env',       'BP_INCLUDE_FILES=nginx.conf:dist/**',
            *pack_args,
        ],
        docker_username=docker_username,
        docker_password=docker_password,
        github_access_token=github_access_token,
        ignore=[
            'node_modules',
            'dist',
            *ignore
        ]
    )


def build_and_push_server_img(
    *,
    src: Path,
    tag_prefix: str,
    image_name: str,
    docker_username: str,
    docker_password: str,
    github_access_token: str,
    pack_args: List[str] = [],
    ignore: List[str] = [],
):
    build_and_push_img(
        src=src,
        tag_prefix=tag_prefix,
        image_name=image_name,
        pack_args=[
            '--builder',   'paketobuildpacks/builder:base',
            '--buildpack', 'paketo-buildpacks/java',
            '--env',       'BP_JVM_VERSION=17',
            '--env',       'BPE_SPRING_PROFILES_ACTIVE=prod',
            *pack_args,
        ],
        docker_username=docker_username,
        docker_password=docker_password,
        github_access_token=github_access_token,
        ignore=[
            'target',
            *ignore
        ]
    )


def build_and_push_img(
    *,
    src: Path,
    tag_prefix: str,
    image_name: str,
    docker_username: str,
    docker_password: str,
    github_access_token: str,
    pack_args: List[str] = [],
    ignore: List[str] = [],
):
    if not github_access_token:
        print('GitHub access token is missing', flush=True, file=sys.stderr)
        exit(1)

    changed, version = get_version(
        src=src, tag_prefix=tag_prefix, ignore=ignore)

    if not changed:
        return

    run(['docker', 'login', '--username', docker_username,
        '--password-stdin'], input=docker_password.encode(), check=True)
    run(['pack', 'build', f'{image_name}:latest', '--path', str(src), '--tag',
        f'{image_name}:{version}', '--publish', *pack_args], check=True)

    create_release(
        tag_prefix=tag_prefix,
        version=version,
        access_token=github_access_token,
        body=f'[Image](https://hub.docker.com/repository/docker/{image_name})'
    )
    print(
        f'Docker image pushed successfully for {tag_prefix}:{version}', flush=True)
