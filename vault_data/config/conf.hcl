ui            = false
api_addr      = "https://127.0.0.1:8200"
disable_mlock = true
default_lease_ttl = "1h"
max_lease_ttl     = "4h"

storage "file" {
  path = "/vault/data"
}

listener "tcp" {
  address     = "0.0.0.0:8200"
  tls_disable = 1
}

secrets {
  path = "secret/"
  type = "kv"
  description = "Key/Value secrets engine for storing sensitive information"
}

auth "approle" {
  description = "AppRole authentication method"
}

secrets {
  path = "transit/"
  type = "transit"
  description = "Transit secrets engine for encrypting and decrypting data"
}

cache {
  use_auto_auth_token = true
}auto_auth {
  method "approle" {
    mount_path = "auth/approle"
    config = {
      role_id_file_path   = "/vault/cre/vault/role-id"
      secret_id_file_path = "/vault/cre/vault/secret-id"
    }
  }

  sink "file" {
    config = {
      path = "/vault/token/vault-token"
    }
  }
}

auto_auth {
  method "approle" {
    mount_path = "auth/approle"
    config = {
      role_id_file_path   = "/vault/cre/backend/role-id"
      secret_id_file_path = "/vault/cre/backend/secret-id"
    }
  }

  sink "file" {
    config = {
      path = "/vault/token/vault-token"
    }
  }
}

auto_auth {
  method "approle" {
    mount_path = "auth/approle"
    config = {
      role_id_file_path   = "/vault/cre/database/role-id"
      secret_id_file_path = "/vault/cre/database/secret-id"
    }
  }

  sink "file" {
    config = {
      path = "/vault/token/vault-token"
    }
  }
}

auto_auth {
  method "approle" {
    mount_path = "auth/approle"
    config = {
      role_id_file_path   = "/vault/cre/frontend/role-id"
      secret_id_file_path = "/vault/cre/frontend/secret-id"
    }
  }

  sink "file" {
    config = {
      path = "/vault/token/vault-token"
    }
  }
}

