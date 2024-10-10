path "secret/backend" {
  capabilities = ["read"]
}

path "secret/db" {
  capabilities = ["read"]
}

path "secret/oauth" {
  capabilities = ["read"]
}

path "transit/decrypt/my-key" {
  capabilities = ["update"]
}