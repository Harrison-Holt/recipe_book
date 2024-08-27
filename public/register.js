
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
           window.location.href = './index.html'; 
        } else {
            const error = await response.json(); 
            console.error("Error: ", error); 
            
        }
    } catch(error) {
        console.error("Error sending user data: ", error); 
    }
}); 