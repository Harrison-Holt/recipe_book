document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("login_submit_button").addEventListener('click', async function(event) {
    event.preventDefault(); 

    let username_or_email = document.getElementById("username_or_email").value; 
    let password = document.getElementById("password").value; 

    try {
        const response = await fetch(`/api/login?username_or_email=${encodeURIComponent(username_or_email)}&password=${encodeURIComponent(password)}`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({ username_or_email, password }); 
        }); 

        if(response.ok) {
            const data = await response.json();

            if(data.token) {

                localStorage.setItem('token', data.token); 
                window.location.href = './index.html'; 
            } else {
                console.error("Login failed: token not recived.")
                alert("Login failed! Try again!"); 
            }
        } else {
            const error = await response.json(); 
            console.error("Error: ", error); 
        }
    } catch(error) {
        console.error("Error sending data: ", error); 
    }
});    
});  