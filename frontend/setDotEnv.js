const vault = require('node-vault')({
    apiVersion: 'v1', // default
    endpoint: 'http://vault:8200', // Vault server address
    token: 'root' // Vault token 
});

const setDotEnv = async () => {
    try {
        const secret = await vault.read('secret/data/front');
        const data = secret.data.data;
        const env = Object.keys(data).map(key => `${key}=${data[key]}`).join('\n');
        require('fs').writeFileSync('.env', env);
    }
    catch (err) {
        console.error(err);
    }
};

setDotEnv();