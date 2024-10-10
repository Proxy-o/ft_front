ui            = false
api_addr      = "https://127.0.0.1:8200"
disable_mlock = true

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