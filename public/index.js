// Helper function to get the current timestamp in milliseconds
function getCurrentTimestamp() {
    return new Date().getTime();
}

// Helper function to check if 24 hours have passed
function has24HoursPassed(lastFetchedTime) {
    const currentTime = getCurrentTimestamp();
    const oneDayInMs = 24 * 60 * 60 * 1000;
    return currentTime - lastFetchedTime >= oneDayInMs;
}

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

// Function to fetch and display 4 different recipes with caching
async function fetchAndDisplayRecipes() {
    const container = document.getElementById('recipes-container');
    if (!container) {
        console.error("Container element 'recipes-container' not found.");
        return;
    }

    // Check if recipes are already stored in localStorage and if 24 hours have passed
    const storedRecipes = JSON.parse(localStorage.getItem('dailyRecipes'));
    const lastFetchedTime = localStorage.getItem('lastFetchedTime');

    if (storedRecipes && lastFetchedTime && !has24HoursPassed(lastFetchedTime)) {
        // Use the cached recipes
        displayRecipes(storedRecipes);
        return;
    }

    // Fetch new recipes and store them
    const promises = [fetchRecipe(), fetchRecipe(), fetchRecipe(), fetchRecipe()];
    const recipes = await Promise.all(promises);

    // Store the recipes in localStorage
    localStorage.setItem('dailyRecipes', JSON.stringify(recipes));
    localStorage.setItem('lastFetchedTime', getCurrentTimestamp());

    // Display the new recipes
    displayRecipes(recipes);
}

// Function to display recipes
function displayRecipes(recipes) {
    const container = document.getElementById('recipes-container');
    container.innerHTML = ''; // Clear previous content

    recipes.forEach((recipe) => {
        if (recipe) {
            const card = document.createElement('div');
            card.classList.add('recipe-card', 'col-md-6', 'mb-4');  // Bootstrap for 2 columns on medium+ screens

            // Create the card HTML structure
            card.innerHTML = `
                <div class="recipe-title">${recipe.title}</div>
                <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image">
            `;

            // Add click event listener to show recipe details in the modal
            card.addEventListener('click', () => {
                displayRecipeInModal(recipe);
            });

            // Append the card to the container
            container.appendChild(card);
        }
    });
}

// Function to display the recipe in the modal
function displayRecipeInModal(recipe) {
    // Set the modal fields with the recipe data
    document.getElementById('modal-recipe-title').textContent = recipe.title || 'No Title';
    document.getElementById('modal-recipe-image').src = recipe.image || '';

    // Construct the detailed summary for the modal
    const summary = `
        ${recipe.title || 'No Title'} is a <b>${(recipe.diets || []).join(", ") || 'N/A'}</b> recipe with ${recipe.servings || 'N/A'} servings. 
        For <b>$${(recipe.pricePerServing || 0).toFixed(2)} per serving</b>, this recipe <b>covers ${recipe.healthScore || 0}%</b> of your daily 
        requirements of vitamins and minerals. One serving contains <b>${recipe.summary || 'N/A'}</b>. It works well as a 
        ${recipe.dishTypes ? recipe.dishTypes.join(", ") : 'N/A'}. Head to the store and pick up ${(recipe.extendedIngredients || [])
        .map(i => i.name).join(", ")} to make it today. 
        From preparation to the plate, this recipe takes approximately <b>${recipe.readyInMinutes || "N/A"} minutes</b>. 
        ${recipe.aggregateLikes || 0} people have tried and liked this recipe.`;

    document.getElementById('modal-recipe-summary').innerHTML = summary;

    // Set servings, preparation, and cooking time
    document.getElementById('modal-recipe-servings').textContent = `Servings: ${recipe.servings || 'N/A'}`;
    document.getElementById('modal-preparation-time').textContent = `Preparation Time: ${recipe.preparationMinutes || 'N/A'} mins`;
    document.getElementById('modal-cooking-time').textContent = `Cooking Time: ${recipe.cookingMinutes || 'N/A'} mins`;

    // Instructions
    const instructionsElement = document.getElementById('modal-recipe-instructions');
    instructionsElement.innerHTML = ''; // Clear previous content
    if (recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0) {
        recipe.analyzedInstructions[0].steps.forEach(step => {
            const li = document.createElement('li');
            li.textContent = step.step;
            instructionsElement.appendChild(li);
        });
    } else {
        instructionsElement.innerHTML = '<li>No instructions available.</li>';
    }

    // Similar Recipes Links (if available)
    const similarRecipesHTML = (recipe.similarRecipes || []).map(r => `
        <a href="${r.link}" target="_blank">${r.title}</a>
    `).join(", ");
    document.getElementById('modal-similar-recipes').innerHTML = similarRecipesHTML || 'No similar recipes available.';

    // Show the modal
    const recipeModal = new bootstrap.Modal(document.getElementById('recipeModal'));
    recipeModal.show();
}

// Call the function when the page loads
window.onload = fetchAndDisplayRecipes();

// Handle "Add to My Recipe" button click
document.getElementById('add-to-recipe').addEventListener('click', () => {
    alert('Recipe added to your collection!');
});

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

