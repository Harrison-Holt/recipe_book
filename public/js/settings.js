document.getElementById("homepage").addEventListener('click', function() {

    window.location.href = './index.html'; 
}); 
document.getElementById("logout").addEventListener('click', function() {

    window.location.href = './login.html'; 
}); 
document.addEventListener('DOMContentLoaded', function () {

    const deleteAccountButton = document.getElementById('deleteAccount');
    if (deleteAccountButton) {
        deleteAccountButton.addEventListener('click', function () {
            if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                // Get the user's token
                const token = localStorage.getItem('token');

                // Send a request to delete the account
                console.log('Token:', token); // Log token to ensure it's being retrieved correctly

                fetch('/api/delete_account', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then(response => {
                    // Check if the response is in JSON format
                    if (response.ok) {
                        return response.json();
                    } else {
                        return response.text().then(text => {
                            throw new Error(text);
                        });
                    }
                })
                .then(data => {
                    if (data.success) {
                        alert("Your account has been successfully deleted.");
                        localStorage.removeItem('token');
                        window.location.href = './login.html'; // Redirect to login page
                    } else {
                        alert("An error occurred: " + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error.message); // Log the full error message
                    alert('An error occurred: ' + error.message);
                });
            }
        }); 
    }}); 
