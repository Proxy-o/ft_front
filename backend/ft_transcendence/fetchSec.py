from hvac import Client
from typing import Callable, Dict, Tuple
import base64
import os

def fetchSec() -> Tuple[Callable[[str], str], Exception]:
    with open('/.vault/role-id') as f:
        role_id = f.read().strip()
    with open('/.vault/secret-id') as f:
        secret_id = f.read().strip()
    
    # os.remove('/.vault/role-id')
    # os.remove('/.vault/secret-id')

    # Authenticate with Vault using AppRole
    client = Client(url=os.environ['VAULT_API_ADDR'])
    client.auth.approle.login(
        role_id=role_id,
        secret_id=secret_id,
    )
    if not client.is_authenticated():
        raise Exception("Vault is not authenticated")

    def read_secret(path: str) -> Dict[str, str]:
        secret = client.read(f'secret/{path}')
        if secret is None:
            raise Exception(f"Error: {path} secret not found")
        return secret['data']
    
    def decrypt64_secret(bytes: str) -> str:
        return base64.b64decode(bytes).decode('utf-8')
    
    def decrypt_secret(secret: str) -> str:
        decrypted = client.secrets.transit.decrypt_data('my-key', ciphertext=secret)
        if decrypted is None:
            raise Exception("Error: failed to decrypt secret")
        return decrypt64_secret(decrypted['data']['plaintext'])

    try:
        be_secrets = read_secret('backend')
        db_secrets = read_secret('db')
        oa_secrets = read_secret('oauth')
        oa_secrets['OAUTH_42_CLIENT_ID'] = decrypt_secret(oa_secrets['OAUTH_42_CLIENT_ID'])
        oa_secrets['OAUTH_42_CLIENT_SECRET'] = decrypt_secret(oa_secrets['OAUTH_42_CLIENT_SECRET'])
        oa_secrets['OAUTH_42_STATE'] = decrypt64_secret(oa_secrets['OAUTH_42_STATE'])
    except Exception as e:
        return None, e

    secrets = be_secrets | db_secrets | oa_secrets

    def get_secret(key: str) -> str:
        return secrets[key]

    return get_secret, None