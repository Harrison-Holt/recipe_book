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

// Function to fetch and display recipes
async function fetchAndDisplayRecipes() {
    const container = document.getElementById('recipes-list');
    if (!container) {
        console.error("Container element 'recipes-list' not found.");
        return;
    }

    // Fetch 6 different recipes using Promise.all()
    const promises = [fetchRecipe(), fetchRecipe(), fetchRecipe(), fetchRecipe(), fetchRecipe(), fetchRecipe()];
    const recipes = await Promise.all(promises);

    // Clear previous content
    container.innerHTML = '';

    // Display each recipe
    recipes.forEach((recipe) => {
        if (recipe) {
            const card = document.createElement('div');
            card.classList.add('col');  // Bootstrap class for columns

            // Create the card HTML structure
            card.innerHTML = `
                <div class="card h-100">
                    <img src="${recipe.image}" class="card-img-top" alt="${recipe.title}">
                    <div class="card-body">
                        <h5 class="card-title">${recipe.title}</h5>
                        <p class="card-text">${recipe.summary.slice(0, 100)}...</p>
                        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#recipeModal">View Details</button>
                    </div>
                </div>
            `;

            // Add click event listener to show recipe details in the modal
            card.querySelector('button').addEventListener('click', () => {
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
}

// Handle search functionality
document.getElementById('search-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const searchQuery = document.getElementById('recipe-search').value.toLowerCase();
    const recipesContainer = document.getElementById('recipes-list');
    const allRecipes = recipesContainer.querySelectorAll('.card');  // Select all recipe cards

    allRecipes.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        if (title.includes(searchQuery)) {
            card.style.display = 'block';  // Show recipes that match search
        } else {
            card.style.display = 'none';   // Hide recipes that don't match
        }
    });
});

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

restrictAccess(); 