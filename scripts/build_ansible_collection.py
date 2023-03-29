#!/usr/bin/env python3

from subprocess import run
import sys
import yaml
from pathlib import Path
root_directory = Path(__file__).parent.parent

sys.path.append(str(root_directory))

from lib.github_utils import create_release, upload_release_asset
from lib.version_utils import get_version

access_token = sys.argv[1]

if not access_token:
    print('GitHub access token is missing', flush=True, file=sys.stderr)
    exit(1)

def update_version(version: str):
    with open('galaxy.yml', 'r') as f:
        data = yaml.safe_load(f)

    data['version'] = f'0.{version}.0'

    with open('galaxy.yml', 'w') as f:
        yaml.safe_dump(data, f)

tag_prefix = 'ansible-collection'
changed, version = get_version(src='roles', tag_prefix=tag_prefix)

if not changed:
    exit()

update_version(version)
run(['ansible-galaxy', 'collection', 'build'], check=True);

release_id = create_release(
    tag_prefix=tag_prefix,
    version=version,
    access_token=access_token
)
upload_release_asset(
    release_id=release_id,
    filename_pattern='mucsi96-kubetools-*.tar.gz',
    access_token=access_token
)
