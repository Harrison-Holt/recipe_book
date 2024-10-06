document.getElementById("register_submit_button").addEventListener('click', async function(event) {
    event.preventDefault(); 

    let username = document.getElementById("username").value; 
    let password = document.getElementById("password").value; 
    let email = document.getElementById("email").value; 

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
    
        const responseText = await response.text(); // Get response as text
    
        if (response.ok) {
            // Try parsing as JSON after verifying the response is successful
            const data = JSON.parse(responseText);
            
            if (data.token) {
                localStorage.setItem('token', data.token);
                window.location.href = './index.html';
            } else {
                console.error("Registration failed: token not received.");
                alert("Registration successful, but no token received. Please log in.");
            }
        } else {
            console.error("Error: ", responseText); // Log the error text
            alert("Registration failed! Please try again.");
        }
    } catch (error) {
        console.error("Error sending user data: ", error);
        alert("An error occurred. Please try again later.");
    }
    
});
