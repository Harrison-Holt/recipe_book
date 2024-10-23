document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password');
    const submitButton = document.getElementById('submit_button');

    // Listen for input on the password field
    passwordInput.addEventListener('input', validatePassword);
    
    function validatePassword() {
        const password = passwordInput.value;

        // Validation rules
        const hasLength = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*]/.test(password);
        const hasNoSpaces = /^[^\s]+$/.test(password); // No spaces

        // Update the DOM based on validation rules
        document.getElementById('length').className = hasLength ? 'text-success' : 'text-danger';
        document.getElementById('uppercase').className = hasUppercase ? 'text-success' : 'text-danger';
        document.getElementById('lowercase').className = hasLowercase ? 'text-success' : 'text-danger';
        document.getElementById('number').className = hasNumber ? 'text-success' : 'text-danger';
        document.getElementById('special').className = hasSpecialChar ? 'text-success' : 'text-danger';
        document.getElementById('spaces').className = hasNoSpaces ? 'text-success' : 'text-danger';

        // Enable or disable submit button based on validation
        if (hasLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar && hasNoSpaces) {
            submitButton.disabled = false; // All requirements are met
        } else {
            submitButton.disabled = true; // Disable the button until all requirements are satisfied
        }
    }

    // Initially disable the submit button until the password is valid
    submitButton.disabled = true;
});

const poolData = {
    UserPoolId: 'us-east-1_DRWagBaO2', 
    ClientId: '3vh2b86tgs6kunsucf0lpmk27s' 
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

