#!/usr/bin/env python3

from subprocess import run
import re
from ansible.module_utils.basic import AnsibleModule

def main():
    fields = {
        'tag_prefix': {'type': 'str', 'required': True},
    }

    module = AnsibleModule(argument_spec=fields)
    tag_prefix = module.params['tag_prefix']

    run(['git', 'fetch', '--tags'], check=True)
    result = run(['git', 'describe', '--tags', f'--match={tag_prefix}-*', '--abbrev=0'], capture_output=True, check=True)
    version = int(re.sub(rf'^{tag_prefix}-', '', result.stdout.decode()))

    module.exit_json(version=version);


if __name__ == '__main__':
    main()