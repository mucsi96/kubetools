#!/usr/bin/env python3

from os import makedirs, path
from subprocess import run
import sys
from pathlib import Path
root_directory = Path(__file__).parent.parent

sys.path.append(str(root_directory))

from lib.github_utils import create_release
from lib.version_utils import get_version
from lib.ansible_utils import load_vars

access_token = sys.argv[1]

if not access_token:
    print('GitHub access token is missing', flush=True, file=sys.stderr)
    exit(1)

data = load_vars(root_directory / '.ansible/vault_key', root_directory / 'vars/vault.yaml')
maven_username = data['maven_username']
maven_password = data['maven_password']

tag_prefix = 'server-lib'
src = 'server_lib'
changed, version = get_version(src=src, tag_prefix=tag_prefix)

if not changed:
    exit()

maven_settings = f'{path.expanduser("~")}/.m2/settings.xml'
makedirs(path.dirname(maven_settings), exist_ok=True)
newVersion=f'1.{version}-SNAPSHOT'
with open(maven_settings, 'w') as f:
    f.write(f'''
    <settings>
        <servers>
            <server>
                <id>ossrh</id>
                <username>{maven_username}</username>
                <password>{maven_password}</password>
            </server>
        </servers>
    </settings>
    ''')

run(['mvn', 'versions:set', f'-DnewVersion={newVersion}'], cwd=src, check=True)
run(['mvn', 'deploy'], cwd=src, check=True)

release_id = create_release(
    tag_prefix=tag_prefix,
    version=version,
    access_token=access_token
    body='''
```
<dependency>
    <groupId>io.github.mucsi96</groupId>
    <artifactId>kubetools</artifactId>
    <version>{newVersion}</version>
</dependency>
```
    '''
)
