const poolData = {
    UserPoolId: 'us-east-1_DRWagBaO2', // Replace with your Cognito User Pool ID
    ClientId: '26prbk0s7glqidsib5rugomb85' // Replace with your Cognito App Client ID
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

// Signup form submission
document.getElementById('signup_form').addEventListener('submit', (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const attributeList = [];

    const dataEmail = {
        Name: 'email',
        Value: email
    };

    const attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
    attributeList.push(attributeEmail);

    userPool.signUp(username, password, attributeList, null, (err, result) => {
        if (err) {
            console.error('Error signing up: ', err.message || JSON.stringify(err));
            alert('Error: ' + err.message || JSON.stringify(err));
            return;
        }

        console.log('User signup successful:', result.user.getUsername());
        // Show the confirmation form
        document.getElementById('signup_form').style.display = 'none';
        document.getElementById('confirmation_form').style.display = 'block';

        // Store username for confirmation
        localStorage.setItem('username', username);
    });
});

// Confirmation form submission
document.getElementById('confirmation_form').addEventListener('submit', (event) => {
    event.preventDefault();

    const username = localStorage.getItem('username');
    const confirmationCode = document.getElementById('code').value;

    const userData = {
        Username: username,
        Pool: userPool
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
        if (err) {
            console.error('Error confirming account: ', err.message || JSON.stringify(err));
            alert('Error: ' + err.message || JSON.stringify(err));
            return;
        }

        console.log('Account confirmed successfully:', result);
        alert('Account confirmed successfully!');

        // Redirect to the login page
        window.location.href = 'signin.html';
    });
});

