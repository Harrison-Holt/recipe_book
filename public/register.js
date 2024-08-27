document.getElementById("register_submit_button").addEventListener('click', async function(event) {
    event.preventDefault(); 

    let username = document.getElementById("username").value; 
    let password = document.getElementById("password").value; 
    let email = document.getElementById("email").value; 

    try {
        const response = await fetch('/api/user_post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        if (response.ok) {
            const data = await response.json();  
            
            if (data.token) {
                localStorage.setItem('token', data.token); 
                window.location.href = './index.html';
            } else {
                console.error("Registration failed: token not received.");
                alert("Registration successful, but no token received. Please log in.");
            }
        } else {
            const error = await response.json(); 
            console.error("Error: ", error); 
            alert("Registration failed! Please try again.");
        }
    } catch(error) {
        console.error("Error sending user data: ", error); 
        alert("An error occurred. Please try again later.");
    }
});
