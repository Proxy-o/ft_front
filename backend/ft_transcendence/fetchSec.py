from hvac import Client
from typing import Callable, Dict

def fetchSec(vault_token: str) -> Callable[[str], str]:

    client = Client(url='http://vault:8200', token=vault_token)
    if not client.is_authenticated():
        raise Exception("Vault is not authenticated")

    def read_secret(path: str) -> Dict[str, str]:
        secret = client.read(f'secret/data/{path}')
        if secret is None:
            raise Exception(f"Error: {path} secret not found")
        return secret['data']['data']

    try:
        be_secrets = read_secret('backend')
        db_secrets = read_secret('db')
        oa_secrets = read_secret('oauth')
    except Exception as e:
        print(e)
        exit(1)

    secrets = be_secrets | db_secrets | oa_secrets

    def get_secret(key: str) -> str:
        return secrets[key]

    return get_secret