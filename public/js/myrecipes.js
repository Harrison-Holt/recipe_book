document.addEventListener('DOMContentLoaded', function () {
    const myRecipesList = document.getElementById('myRecipesList');
    const recipeModal = new bootstrap.Modal(document.getElementById('recipeModal'));
    const recipeTitle = document.getElementById('recipeTitle');
    const recipeDescription = document.getElementById('recipeDescription');
    const recipeIngredients = document.getElementById('recipeIngredients');
    const recipeInstructions = document.getElementById('recipeInstructions');
    const editRecipeBtn = document.getElementById('editRecipeBtn');
    const deleteRecipeBtn = document.getElementById('deleteRecipeBtn');
    let currentRecipeId = null;

    // Fetch user's recipes from the backend
    function fetchUserRecipes() {
        fetch('/api/get_recipes', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => response.json())
        .then(data => {
            data.recipes.forEach(recipe => {
                const recipeCard = document.createElement('div');
                recipeCard.classList.add('col-md-4', 'mb-4');
                recipeCard.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${recipe.title}</h5>
                            <img src="${recipe.image_url}" alt="${recipe.title}" class="img-fluid mb-2"/>
                            <button class="btn btn-primary view-details" data-id="${recipe.id}">View Details</button>
                        </div>
                    </div>`;
                myRecipesList.appendChild(recipeCard);
            });
            attachEventListeners();
        })
        .catch(error => console.error('Error fetching user recipes:', error));
    }

    // Attach event listeners to dynamically created elements
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

    // Fetch recipe details and display them in the modal
    function fetchRecipeDetails(recipeId) {
        fetch(`/api/user/recipes/${recipeId}`, { // Adjust endpoint for fetching recipe details
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => response.json())
        .then(data => {
            recipeTitle.textContent = data.title;
            recipeDescription.textContent = data.description;
            recipeIngredients.innerHTML = ''; // Clear previous ingredients
            data.ingredients.forEach(ingredient => {
                const li = document.createElement('li');
                li.textContent = ingredient;
                recipeIngredients.appendChild(li);
            });
            recipeInstructions.textContent = data.instructions;
            recipeModal.show();
        })
        .catch(error => console.error('Error fetching recipe details:', error));
    }

    // Handle deleting a recipe
    deleteRecipeBtn.addEventListener('click', function () {
        fetch(`/api/user/recipes/${currentRecipeId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Recipe deleted successfully.');
                location.reload(); // Refresh the page to update the recipe list
            } else {
                alert('Failed to delete recipe: ' + data.message);
            }
        })
        .catch(error => console.error('Error deleting recipe:', error));
    });

    // Initialize fetching user's recipes
    fetchUserRecipes();
});
