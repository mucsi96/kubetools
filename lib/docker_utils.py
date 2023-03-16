
from pathlib import Path
from typing import List
from docker.client import from_env
from lib.version_utils import get_version, set_version

def build_and_push_img(
    *,
    src: Path,
    docker_context_path: Path,
    tag_prefix: str,
    image_name: str,
    docker_username: str,
    docker_password: str,
    ignore: List[str] = [],
    ):

    changed, version = get_version(src=src, tag_prefix=tag_prefix, ignore=ignore)

    if not changed:
        print(f'No changes detected since {tag_prefix}:{version}')
        return

    print(f'Changes detected for {tag_prefix}. New version: {version}')

    client = from_env()

    for build_log in client.api.build(
        path=str(docker_context_path),
        tag=f'{image_name}:latest',
        rm=True
    ):
        print(build_log.decode().strip())

    image = client.images.get(f'{image_name}:latest')
    image.tag(image_name, tag=version)

    print("Docker image built.")

    for push_log in client.images.push(
        repository=image_name,
        tag='latest',
        auth_config={
            'username': docker_username,
            'password': docker_password
        },
        stream=True
    ):
        print(push_log.decode().strip())

    for push_log in client.images.push(
        repository=image_name,
        tag=version,
        auth_config={
            'username': docker_username,
            'password': docker_password
        },
        stream=True
    ):
        print(push_log.decode().strip())
        
    set_version(tag_prefix=tag_prefix, version=version)
    print(f'Docker image pushed successfully for {tag_prefix}:{version}')