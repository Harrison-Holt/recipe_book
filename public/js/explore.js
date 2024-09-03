document.addEventListener('DOMContentLoaded', function () {
    const recipeList = document.getElementById('recipeList');
    const recipeModal = new bootstrap.Modal(document.getElementById('recipeModal'));
    const recipeTitle = document.getElementById('recipeTitle');
    const recipeDescription = document.getElementById('recipeDescription');
    const recipeIngredients = document.getElementById('recipeIngredients');
    const recipeInstructions = document.getElementById('recipeInstructions');
    const addToMyRecipesBtn = document.getElementById('addToMyRecipesBtn');
    let currentRecipeId = null;
    const API_KEY = process.env.API_KEY;

    // Fetch the userId (username) from the JWT token or local storage
    const token = localStorage.getItem('token');
    let userId = null;

    // Decode the token to extract the username (userId)
    if (token) {
        try {
            const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
            userId = decodedToken.username; // Assuming the username is stored in the token payload
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    }

    // Fetch recipes from Spoonacular
    function fetchRecipes() {
        fetch(`https://api.spoonacular.com/recipes/random?number=30&apiKey=${API_KEY}`)
            .then(response => response.json())
            .then(data => {
                const recipesWithImages = data.recipes.filter(recipe => recipe.image && recipe.image.trim() !== '');

                recipesWithImages.forEach(recipe => {
                    const recipeCard = document.createElement('div');
                    recipeCard.classList.add('col-md-4', 'mb-4');
                    recipeCard.innerHTML = `
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${recipe.title}</h5>
                                <img src="${recipe.image}" alt="${recipe.title}" class="img-fluid mb-2"/>
                                <button class="btn btn-primary view-details" data-id="${recipe.id}">View Details</button>
                            </div>
                        </div>`;
                    recipeList.appendChild(recipeCard);
                });
                attachEventListeners();
            })
            .catch(error => console.error('Error fetching recipes:', error));
    }

    // Fetch recipe details from Spoonacular
    function fetchRecipeDetails(recipeId) {
        fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`)
            .then(response => response.json())
            .then(data => {
                recipeTitle.textContent = data.title;
                recipeDescription.textContent = data.summary;
                recipeIngredients.innerHTML = ''; // Clear previous ingredients
                data.extendedIngredients.forEach(ingredient => {
                    const li = document.createElement('li');
                    li.textContent = ingredient.original;
                    recipeIngredients.appendChild(li);
                });
                recipeInstructions.textContent = data.instructions;
                recipeModal.show();
            })
            .catch(error => console.error('Error fetching recipe details:', error));
    }

    // Add recipe to user's collection
    addToMyRecipesBtn.addEventListener('click', function () {
        if (!currentRecipeId || !userId) {
            alert('Error: Missing recipe selection or user information.');
            return;
        }

        // Fetch full details of the recipe to include necessary fields
        fetch(`https://api.spoonacular.com/recipes/${currentRecipeId}/information?apiKey=${API_KEY}`)
            .then(response => response.json())
            .then(recipeData => {
                const recipePayload = {
                    userId: userId, 
                    title: recipeData.title || '',
                    image_url: recipeData.image || null,
                    description: recipeData.summary || '',
                    ingredients: recipeData.extendedIngredients.map(ing => ing.original),
                    instructions: recipeData.instructions || '',
                    source_id: recipeData.id,
                    is_user_created: false
                };

                // Log payload for debugging
                console.log('Payload being sent:', recipePayload);

                fetch('/api/add_recipe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(recipePayload)
                })
                .then(response => {
                    if (!response.ok) {
                        response.json().then(errorData => console.error('Error details:', errorData));
                        throw new Error('Failed to add recipe: ' + response.status);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        alert('Recipe added to your collection!');
                        recipeModal.hide();
                    } else {
                        alert('Failed to add recipe: ' + data.message);
                    }
                })
                .catch(error => console.error('Error adding recipe:', error));
            })
            .catch(error => console.error('Error fetching recipe details:', error));
    });

    // Attach event listeners to view details buttons
    function attachEventListeners() {
        const viewDetailsButtons = document.querySelectorAll('.view-details');
        viewDetailsButtons.forEach(button => {
            button.addEventListener('click', function () {
                const recipeId = this.getAttribute('data-id');
                currentRecipeId = recipeId; // Store the current recipe ID
                fetchRecipeDetails(recipeId);
            });
        });
    }

    // Initialize
    fetchRecipes();
});


document.getElementById("homepage").addEventListener('click', function() {
    window.location.href = './index.html'; 
}); 
document.getElementById("settings").addEventListener('click', function() {
    window.location.href = './settings.html'; 
}); 
document.getElementById("logout").addEventListener('click', function() {

    window.location.href = './login.html'; 
}); 

