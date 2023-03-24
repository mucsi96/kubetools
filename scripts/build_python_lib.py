#!/usr/bin/env python3

from pathlib import Path
import sys
root_directory = Path(__file__).parent.parent

sys.path.append(str(root_directory))

from lib.github_utils import create_release
from lib.version_utils import get_version

tag_prefix = 'python-lib'
changed, version = get_version(src='lib', tag_prefix=tag_prefix)

if not changed:
    print(f'No changes detected since {version}', flush=True)
    exit()

print(f'Changes detected. New version: {version}', flush=True)

create_release(tag_name=f'{tag_prefix}-{version}', access_token=sys.argv[1])
