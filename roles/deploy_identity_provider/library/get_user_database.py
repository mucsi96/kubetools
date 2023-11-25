#!/usr/bin/env python3

from ansible.module_utils.basic import AnsibleModule
from argon2 import PasswordHasher

def main():
    fields = {
        'authorized_users': {'type': 'list', 'required': True},
    }

    module = AnsibleModule(argument_spec=fields)
    authorized_users = module.params['authorized_users']
    ph = PasswordHasher()
    usernames = list(map(lambda user: user['username'], authorized_users))
    users = list(map(lambda user: {
                 'displayname': user['display_name'],
                 'password': ph.hash(user['password']),
                 'email': user['email'],
                 'groups': user['roles']
                 }, authorized_users))
    
    result = dict(zip(usernames, users))

    module.exit_json(result=result)

if __name__ == '__main__':
    main()
