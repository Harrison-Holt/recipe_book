async function fetchDailyRecipe() {
    try {
        // Make a request to your Lambda API Gateway URL
        const response = await fetch('https://h1ynlo4u7d.execute-api.us-east-1.amazonaws.com/dev/daily-recipe', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        // Check if the request was successful
        if (!response.ok) {
            console.error(`Error: ${response.status} - ${response.statusText}`);
            return;
        }

        // Parse the JSON response
        const result = await response.json();

        // Access the recipes array from the returned data
        const recipes = result.data.recipes;  // 'recipes' is nested under 'data'

        // Get the container element where recipes will be displayed
        const recipesContainer = document.getElementById('recipes-container');
        
        // Check if the element exists to avoid the 'null' error
        if (!recipesContainer) {
            console.error("Error: 'recipes-container' element not found in the DOM.");
            return;
        }

        recipesContainer.innerHTML = '';  // Clear any previous data

        // Loop through each recipe and add it to the DOM
        recipes.forEach((recipe, index) => {
            const recipeElement = document.createElement('div');
            recipeElement.classList.add('recipe');

            // Example of adding recipe title, image, and summary
            recipeElement.innerHTML = `
                <h2>Recipe ${index + 1}: ${recipe.title}</h2>
                <img src="${recipe.image}" alt="${recipe.title}" />
                <p>${recipe.summary}</p>
                <p><strong>Servings:</strong> ${recipe.servings}</p>
                <p><strong>Ready in:</strong> ${recipe.readyInMinutes} minutes</p>
                <p><a href="${recipe.sourceUrl}" target="_blank">See full recipe</a></p>
            `;

            // Append the recipe to the container
            recipesContainer.appendChild(recipeElement);
        });

    } catch (error) {
        console.error('Error fetching recipes:', error);
    }
}

// Call the function when the page loads
window.onload = fetchDailyRecipe;  // Make sure this is the correct function name


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