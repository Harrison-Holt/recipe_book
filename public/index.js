// Function to fetch a single recipe
async function fetchRecipe() {
    try {
        const response = await fetch('https://h1ynlo4u7d.execute-api.us-east-1.amazonaws.com/dev/daily-recipe', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            console.error(`Connection Error: ${response.status} - ${response.statusText}`);
            return null;
        }

        const data = await response.json();
        return data.data.recipes[0];  // Assuming 'recipes' is an array and we're fetching one recipe
    } catch (error) {
        console.error('Error fetching recipe:', error);
        return null;
    }
}

// Function to fetch and display 4 different recipes
async function fetchAndDisplayRecipes() {
    const container = document.getElementById('recipes-container');
    if (!container) {
        console.error("Container element 'recipes-container' not found.");
        return;
    }

    // Fetch 4 different recipes using Promise.all()
    const promises = [fetchRecipe(), fetchRecipe(), fetchRecipe(), fetchRecipe()];
    const recipes = await Promise.all(promises);

    // Display each recipe
    recipes.forEach((recipe) => {
        if (recipe) {
            const card = document.createElement('div');
            card.classList.add('col-6', 'mb-4');  // Bootstrap column and margin

            // Create the card HTML structure
            card.innerHTML = `
                <div class="recipe-card">
                    <div class="recipe-title">${recipe.title}</div>
                    <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image">
                    <div class="recipe-details">
                        <p><strong>Summary:</strong> ${recipe.summary || 'No summary available.'}</p>
                        <p><strong>Instructions:</strong> ${recipe.instructions || 'No instructions provided.'}</p>
                        <p><strong>Servings:</strong> ${recipe.servings || 'N/A'}</p>
                        <p><strong>Preparation Time:</strong> ${recipe.preparationMinutes || 'N/A'} mins</p>
                        <p><strong>Cooking Time:</strong> ${recipe.cookingMinutes || 'N/A'} mins</p>
                    </div>
                </div>
            `;

            // Add click event listener to toggle the details
            card.querySelector('.recipe-card').addEventListener('click', () => {
                card.querySelector('.recipe-card').classList.toggle('active');
            });

            // Append the card to the container
            container.appendChild(card);
        }
    });
}

// Call the function when the page loads
window.onload = fetchAndDisplayRecipes();

// Function to decode JWT and extract the payload
function decodeJWT(token) {
    try {
        const payload = token.split('.')[1];
        const decodedPayload = atob(payload);
        return JSON.parse(decodedPayload);
    } catch (error) {
        console.error('Invalid token format', error);
        return null;
    }
}

// Function to check if token is expired
function isTokenExpired(token) {
    const decodedToken = decodeJWT(token);
    if (!decodedToken) return true;  // If token can't be decoded, assume it's expired
    const currentTime = Math.floor(Date.now() / 1000);  // Current time in seconds
    return decodedToken.exp < currentTime;  // Check if token has expired
}

// Function to restrict page access
function restrictAccess() {
    const token = localStorage.getItem('access_token');
    
    if (!token || isTokenExpired(token)) {
        // If no token or token is expired, redirect to login page
        window.location.href = 'signin.html';
    } else {
        // Token is valid, display username
        displayUsername();
    }
}

// Display the username on the page
function displayUsername() {
    const token = localStorage.getItem('access_token');
    if (token) {
        const decodedToken = decodeJWT(token);
        if (decodedToken) {
            const username = decodedToken['cognito:username'];  // Assuming 'cognito:username' contains the username
            console.log(username);
            document.getElementById('username').textContent = username;
        }
    }
}

// Logout functionality
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logout_button');
    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault();
            // Clear the access token
            localStorage.removeItem('access_token');
            // Redirect to the login page
            window.location.href = 'signin.html';
        });
    }
});

// Call restrict access function to check if the user is logged in
restrictAccess();
