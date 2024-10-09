const poolData = {
    UserPoolId: 'us-east-1_kFP9s1ZY2', 
    ClientId: '2n5lbtafe8ul23vb7u80803nfb'
}; 

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

document.getElementById('submit_button').addEventListener('click', (event) => {
    event.preventDefault();

    let username = document.getElementById('username').value; 
    let email = document.getElementById('email').value; 
    let password = document.getElementById('password').value; 
    let phone_number = document.getElementById('phone_number').value; // Get the phone number

    signUpWithCognito(username, email, password, phone_number); 
}); 

function signUpWithCognito(username, email, password, phone_number) {
    const attributeList = [];

    // Email attribute
    const dataEmail = {
        Name: 'email',
        Value: email
    };
    const attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
    attributeList.push(attributeEmail);

    // Phone number attribute
    const dataPhoneNumber = {
        Name: 'phone_number', // Cognito uses this exact name for phone numbers
        Value: phone_number
    };
    const attributePhoneNumber = new AmazonCognitoIdentity.CognitoUserAttribute(dataPhoneNumber);
    attributeList.push(attributePhoneNumber);

    // Sign up the user with Cognito
    userPool.signUp(username, password, attributeList, null, (err, result) => {
        if (err) {
            console.error('Error signing up: ', err.message || JSON.stringify(err)); 
            alert('Error: ' + err.message || JSON.stringify(err)); 
            return;
        }

        const cognitoUser = result.user;
        console.log('User signup successful: ', cognitoUser); 

        window.location.href = 'index.html'; 
    });
}
