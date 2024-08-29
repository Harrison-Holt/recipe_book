function verifyToken() {
    const token = localStorage.getItem('token');

    if (!token) {
        console.log("No token found, redirecting to login.");
        window.location.href = './login.html';
        return;
    }

    console.log("Token found, verifying...");

    fetch('/api/verify_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (!data.valid) {
            console.log("Token invalid, removing and redirecting.");
            localStorage.removeItem('token');
            window.location.href = './login.html';
        } else {
            console.log("Token verified successfully.");
            const userGreeting = document.getElementById("greeting");
            if (userGreeting) {
                userGreeting.textContent = `Welcome, ${data.decoded.username}`;
            }
        }
    })
    .catch(error => {
        console.error("Error verifying token: ", error);
        localStorage.removeItem('token');
        window.location.href = './login.html';
    });
}
