document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("login_submit_button").addEventListener('click', async function(event) {
    event.preventDefault(); 

    let username = document.getElementById("username").value; 
    let password = document.getElementById("password").value; 

    try {
        const response = await fetch(`/api/login`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({ username, password })
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