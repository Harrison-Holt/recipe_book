async function fetch_daily_recipes() {
    try {
        const response = await fetch('https://h1ynlo4u7d.execute-api.us-east-1.amazonaws.com/dev/daily-recipe', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            console.error(`Connection Error: ${response.status} - ${response.statusText}`);
            const errorData = await response.text();
            console.error("Error response body:", errorData);
            return;
        }

        const data = await response.json();
        displayRecipeCards(data); // Call function to display recipe cards
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
}

// Function to display recipe cards in a Bootstrap grid
function displayRecipeCards(recipes) {
    const container = document.getElementById('recipe-container');
    recipes.forEach((recipe) => {
        const card = document.createElement('div');
        card.classList.add('col-6'); // Using Bootstrap's col-6 for 2 columns

        // Create the card HTML structure
        card.innerHTML = `
            <div class="recipe-card">
                <div class="recipe-title">${recipe.title}</div>
                <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image">
                <div class="recipe-details">
                    <p><strong>Summary:</strong> ${recipe.summary}</p>
                    <p><strong>Instructions:</strong> ${recipe.instructions}</p>
                    <p><strong>Servings:</strong> ${recipe.servings}</p>
                    <p><strong>Preparation Time:</strong> ${recipe.preparationMinutes} mins</p>
                    <p><strong>Cooking Time:</strong> ${recipe.cookingMinutes} mins</p>
                </div>
            </div>
        `;

        // Add click event listener to toggle the details
        card.querySelector('.recipe-card').addEventListener('click', () => {
            card.querySelector('.recipe-card').classList.toggle('active');
        });

        // Append the card to the container
        container.appendChild(card);
    });
}


// Function to decode JWT and extract the payload
function decodeJWT(token) {
    const payload = token.split('.')[1]; 
    const decodedPayload = atob(payload); 
    return JSON.parse(decodedPayload); 
}

// Function to check if token is expired
function isTokenExpired(token) {
    const decodedToken = decodeJWT(token);
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return decodedToken.exp < currentTime; // Check if token has expired
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
        const username = decodedToken['cognito:username']; 
        console.log(username); 
        document.getElementById('username').textContent = username;
    }
}

// Logout functionality
document.getElementById('logout_button').addEventListener('click', (event) => {
    event.preventDefault();
    // Clear the access token
    localStorage.removeItem('access_token');
    // Redirect to the login page
    window.location.href = 'signin.html';
});



restrictAccess();
fetch_daily_recipes(); 