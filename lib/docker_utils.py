
import subprocess
from pathlib import Path
from typing import List
from lib.version_utils import get_version, set_version

def build_and_push_img(
    *,
    src: Path,
    tag_prefix: str,
    image_name: str,
    docker_username: str,
    docker_password: str,
    ignore: List[str] = [],
    ):

    changed, version = get_version(src=src, tag_prefix=tag_prefix, ignore=ignore)

    if not changed:
        print(f'No changes detected since {tag_prefix}:{version}', flush=True)
        return

    print(f'Changes detected for {tag_prefix}. New version: {version}', flush=True)

    subprocess.run(['docker', 'login', '--username', docker_username, '--password-stdin'], input=docker_password.encode(), check=True)

    build_command = ['pack', 'build', f'{image_name}:latest', '--path', str(src), '--tag', f'{image_name}:{version}']
    print(' '.join(build_command), flush=True)

    subprocess.run(build_command, check=True)

    subprocess.run(['docker', 'push', f'{image_name}', '--all-tags'], check=True)
        
    set_version(tag_prefix=tag_prefix, version=version)
    print(f'Docker image pushed successfully for {tag_prefix}:{version}', flush=True)