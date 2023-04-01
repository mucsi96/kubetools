#!/usr/bin/env python3

from ansible.module_utils.basic import AnsibleModule
from argon2 import PasswordHasher

def main():
    fields = {
        'sso_users': {'type': 'list', 'required': True},
    }

    module = AnsibleModule(argument_spec=fields)
    sso_users = module.params['sso_users']
    ph = PasswordHasher()
    usernames = list(map(lambda user: user['username'], sso_users))
    users = list(map(lambda user: {
                 'displayname': user['display_name'],
                 'password': ph.hash(user['password']),
                 'email': user['email'],
                 'groups': user['roles']
                 }, sso_users))
    
    result = dict(zip(usernames, users))

    module.exit_json(result=result)

if __name__ == '__main__':
    main()
