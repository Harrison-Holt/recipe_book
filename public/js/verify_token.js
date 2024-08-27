window.onload = function() {
    const token = localStorage.getItem('token'); 

    if (!token) {
        window.location.href = './login.html'; 
    } else {

        fetch('/api/verify_token', {
            method: 'POST', 
            headers: 
            {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

        .then(response => response.json())
        .then(data => {

            if(!data.valid) {
                localStorage.removeItem('token'); 
                window.location.href = './login.html'; 
            }
            else {
                document.getElementById("user_greeting").textContent = `Welcome, ${data.decoded.username}`; 
            }
        })
        .catch(error => {
            console.error("Error verifying token: ", error); 
            localStorage.removeItem('token'); 
            window.location.href = './login.html'; 
        }); 
    }
}; 

document.getElementById("logout").addEventListener('click', function() {
    localStorage.removeItem('token'); 
    window.location.href = './login.html'; 
}); 