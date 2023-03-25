#!/usr/bin/env python3

import sys
from pathlib import Path
from setuptools import sandbox
root_directory = Path(__file__).parent.parent

sys.path.append(str(root_directory))

from lib.github_utils import create_release, upload_release_asset
from lib.version_utils import get_version

if not sys.argv[1]:
    print('GitHub access token is missing', flush=True, file=sys.stderr)
    exit(1)

tag_prefix = 'python-lib'
changed, version = get_version(src='lib', tag_prefix=tag_prefix)

if not changed:
    exit()

sandbox.run_setup('setup.py', ['bdist_wheel'])

release_id = create_release(
    tag_prefix=tag_prefix,
    version=version,
    access_token=sys.argv[1]
)
upload_release_asset(
    release_id=release_id,
    local_filename_pattern='dist/kubetools-*.whl',
    release_filename=f'kubetools-{version}.whl',
    access_token=sys.argv[1]
)
