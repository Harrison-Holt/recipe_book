
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

// Signup form submission
document.getElementById('submit_button').addEventListener('click', (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signUpWithCognito(username, email, password);
});

function signUpWithCognito(username, email, password) {
    const attributeList = [];

    // Email attribute
    const dataEmail = {
        Name: 'email',
        Value: email
    };

    const attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
    attributeList.push(attributeEmail);

    // Generate the SECRET_HASH
    const secretHash = getSecretHash(username, poolData.ClientId, clientSecret);

    // Sign up the user with Cognito
    userPool.signUp(username, password, attributeList, { SecretHash: secretHash }, (err, result) => {
        if (err) {
            console.error('Error signing up: ', err.message || JSON.stringify(err));
            alert('Error: ' + err.message || JSON.stringify(err));
            return;
        }

        const cognitoUser = result.user;
        console.log('User signup successful:', cognitoUser);

        window.location.href = 'confirm_email.html';
    });
}

