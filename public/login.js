document.getElementById("login_submit_button").addEventListener('click', async function(event) {
    event.preventDefault(); 

    let username_or_email = document.getElementById("username_or_email").value; 
    let password = document.getElementById("password").value; 

    try {
        const response = await fetch(`/api/user_get?username_or_email=${encodeURIComponent(username_or_email)}&password=${encodeURIComponent(password)}`, {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json'
            }        
        }); 

        if(response.ok) {
            window.location.href = './index.html'; 
        } else {
            const error = await response.json(); 
            console.error("Error: ", error); 
        }
    } catch(error) {
        console.error("Error sending data: ", error); 
    }
});     