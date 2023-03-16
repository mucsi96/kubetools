#!/usr/bin/env python3

import subprocess
import re
from ansible.module_utils.basic import AnsibleModule

def main():
    fields = {
        'tag_prefix': {'type': 'str', 'required': True},
    }

    module = AnsibleModule(argument_spec=fields)
    tag_prefix = module.params['tag_prefix']

    subprocess.getoutput('git fetch --tags')
    tag = subprocess.getoutput(f'git describe --tags --match={tag_prefix}-* --abbrev=0')
    version = int(re.sub(rf'^{tag_prefix}-', '', tag))

    module.exit_json(version=version);


if __name__ == '__main__':
    main()