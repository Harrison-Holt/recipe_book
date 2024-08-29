document.getElementById("homepage").addEventListener('click', function() {

    window.location.href = './index.html'; 
}); 

document.addEventListener('DOMContentLoaded', function () {
    // Attach event listener to the delete account button
    const deleteAccountButton = document.getElementById('deleteAccount');
    if (deleteAccountButton) {
        deleteAccountButton.addEventListener('click', function () {
            if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                // Get the user's token
                const token = localStorage.getItem('token');

                // Send a request to delete the account
                fetch('/api/delete_account', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then(response => response.json())
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
                    console.error('Error:', error);
                    alert('An error occurred while deleting your account. Please try again later.');
                });
            }
        });
    }
});
