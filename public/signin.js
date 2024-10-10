require('dotenv').config(); // Load environment variables

const poolData = {
    UserPoolId: process.env.USER_POOL_ID, 
    ClientId: process.env.CLIENT_ID
};

const clientSecret = process.env.CLIENT_SECRET; 

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

// Function to calculate SECRET_HASH
function getSecretHash(username, clientId, clientSecret) {
    const crypto = require('crypto');
    return crypto.createHmac('SHA256', clientSecret)
        .update(username + clientId)
        .digest('base64');
}

function signInWithCognito(username, password) {
    const authenticationData = {
        Username: username,
        Password: password
    };

    // Calculate SECRET_HASH
    const secretHash = getSecretHash(username, poolData.ClientId, clientSecret);

    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: username,
        Password: password,
        SecretHash: secretHash // Pass the secret hash here
    });

    const userData = {
        Username: username,
        Pool: userPool
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            console.log('Access token:', result.getAccessToken().getJwtToken());
            alert('Login successful!');
        },

        onFailure: function (err) {
            console.error('Login failed:', err.message || JSON.stringify(err));
            alert('Login failed: ' + (err.message || JSON.stringify(err)));
        }
    });
}

// Example of using the signInWithCognito function
document.getElementById('submit_button').addEventListener('click', (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    signInWithCognito(username, password);
});
