const poolData = {
    UserPoolId: 'us-east-1_kFP9s1ZY2', 
    ClientId: '2n5lbtafe8ul23vb7u80803nfb'
}; 

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData); 


document.getElementById('submit_button').addEventListener('click', (event) => {

    let username = document.getElementById('username').value; 
    let email = document.getElementById('email').value; 
    let password = document.getElementById('password').value; 

    signUpWithCognito(username, email, password); 
}); 

function signUpWithCognito(username, email, password) {
    const attributeList = []; 

    const dataEmail = {
        Name: 'email', 
        Value: email
    }

    const attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail); 
    attributeList.push(attributeEmail); 

    userPool.signUp(username, password, attributeList, null, (err, result) => {

        if(err) {
            console.error('Error signing up: ', err.message || JSON.stringify(err)); 
            alert('Error: '+ err.message ||  JSON.stringify(err)); 
            return; 
        }

        const cognitoUser = result.user; 
        console.log('User signup successful: ', cognitoUser); 
         
        window.location.href = 'index.html'; 
    }); 
}