document.getElementById('submit_button').addEventListener('click', (event) => {
    event.preventDefault();

    let username = document.getElementById('username').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    send_data_to_db(username, email, password);
});

async function send_data_to_db(username, email, password) {
    try {
        const response = await fetch('https://x39ftxl842.execute-api.us-east-1.amazonaws.com/create-account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        });

        if (!response.ok) {
            console.error(`Error connecting! Status: ${response.status}`);
            return;
        }

        const data = await response.json();
        console.log(data);
        window.location.href = 'index.html'; 

    } catch (error) {
        console.error('Error sending data! ', error);
    }
}
