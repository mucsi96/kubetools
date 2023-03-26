#!/usr/bin/env python3

from os import getenv
from subprocess import run
import sys
from pathlib import Path
root_directory = Path(__file__).parent.parent

sys.path.append(str(root_directory))

from lib.github_utils import create_release, upload_release_asset
from lib.version_utils import get_version

access_token = sys.argv[1]

if not access_token:
    print('GitHub access token is missing', flush=True, file=sys.stderr)
    exit(1)

tag_prefix = 'server-lib'
src = 'server_lib'
changed, version = get_version(src=src, tag_prefix=tag_prefix)

if not changed:
    exit()

run(['mvn', 'versions:set', f'-DnewVersion=1.{version}'], cwd=src, check=True)
run(['mvn', 'deploy'], cwd=src, check=True)
mvn_repo = f'{src}/target/mvn-repo'
run(['git', 'init'], cwd=mvn_repo, check=True)
run(['git', 'add', '-A'], cwd=mvn_repo, check=True)
run(['git', 'commit', '-m', f'deploy-version-{version}'], cwd=mvn_repo, check=True)
run(['git', 'push', '-f', f'git@github.com:{getenv("GITHUB_REPOSITORY")}.git main:mvn-repo'], cwd=mvn_repo, check=True)

release_id = create_release(
    tag_prefix=tag_prefix,
    version=version,
    access_token=access_token
)
