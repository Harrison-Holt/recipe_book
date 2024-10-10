const poolData = {
    UserPoolId: 'us-east-1_DRWagBaO2', 
    ClientId: '3vh2b86tgs6kunsucf0lpmk27s' 
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

document.getElementById('signin_button').addEventListener('click', (event) => {
    event.preventDefault();

    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    loginWithCognito(username, password);
});

function loginWithCognito(username, password) {
    const authenticationData = {
        Username: username,
        Password: password
    };

    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

    const userData = {
        Username: username,
        Pool: userPool
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function(result) {
            console.log('Login success!');
            console.log('Access token: ' + result.getAccessToken().getJwtToken());

            // Store the token in localStorage or sessionStorage if you need to keep the user logged in
            localStorage.setItem('access_token', result.getAccessToken().getJwtToken());

            // Redirect to another page after login
            window.location.href = 'index.html'; 
        },

        onFailure: function(err) {
            console.error('Login failed: ', err.message || JSON.stringify(err));
            alert('Login failed: ' + err.message || JSON.stringify(err));
        },

    });
}