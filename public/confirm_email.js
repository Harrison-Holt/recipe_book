const poolData = {
    UserPoolId: 'us-east-1_kFP9s1ZY2', 
    ClientId: '2n5lbtafe8ul23vb7u80803nfb'
}; 

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

document.getElementById('confirm_button').addEventListener('click', (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const confirmationCode = document.getElementById('code').value;

    confirmAccount(username, confirmationCode);
});

function confirmAccount(username, code) {
    const userData = {
        Username: username,
        Pool: userPool
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    // Confirm the user registration
    cognitoUser.confirmRegistration(code, true, (err, result) => {
        if (err) {
            console.error('Error confirming account: ', err.message || JSON.stringify(err));
            alert('Error: ' + err.message || JSON.stringify(err));
            return;
        }

        console.log('Account confirmed successfully: ', result);
        alert('Account confirmed successfully!');

        // Redirect to the login page
        window.location.href = 'index.html'; 
    });
}