const fs = require('fs');
const { exit } = require('process');
const vault = require('node-vault')({
    apiVersion: 'v1',
    endpoint: process.env.VAULT_API_ADDR, // Vault address from environment
    token: '' // Token will be set after AppRole login
});

// Read role-id and secret-id from .vault directory
const VAULT_ROLE_ID = fs.readFileSync('/.vault/role-id', 'utf8').trim();
const VAULT_SECRET_ID = fs.readFileSync('/.vault/secret-id', 'utf8').trim();

const removeVaultFiles = async () => {
    try {
        await fs.promises.rm('/.vault/role-id', { force: true });
        await fs.promises.rm('/.vault/secret-id', { force: true });
        console.log('Role ID and Secret ID files removed successfully');
    } catch (err) {
        console.error('Error removing role-id or secret-id:', err);
    }
};

const setDotEnv = async () => {
    try {
        // Log into Vault using AppRole
        const authResponse = await vault.approleLogin({ role_id: VAULT_ROLE_ID, secret_id: VAULT_SECRET_ID });
        vault.token = authResponse.auth.client_token;

        // Read the secrets from Vault
        const secret = await vault.read('secret/front');
        const data = secret.data;

        // Convert the secrets into .env format and write to .env file
        const env = Object.keys(data).map(key => `${key}=${data[key]}`).join('\n');
        fs.writeFileSync('.env', env);

        console.log('.env file created successfully');
        
        // Remove Vault files after successful execution
        await removeVaultFiles();
    } catch (err) {
        console.error('Error setting .env:', err);
        exit(1); // Exit the process if there is an error
    }
};

setDotEnv();
