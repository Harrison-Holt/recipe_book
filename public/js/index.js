document.getElementById("settings").addEventListener('click', function() {
    window.location.href = './settings.html'; 
}); 

document.getElementById("logout").addEventListener('click', function() {
    localStorage.removeItem('token'); // Clear the token on logout
    window.location.href = './login.html'; 
});

document.addEventListener('DOMContentLoaded', function () {
    const exploreRecipesBtn = document.getElementById('exploreRecipesBtn');
    const createRecipeBtn = document.getElementById('createRecipeBtn');
    const userGreeting = document.getElementById('user_greeting');
    const gridContainer = document.querySelector('.grid-container');

    // Function to decode JWT token and extract user data
    function decodeToken(token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
            return payload;
        } catch (error) {
            console.error('Failed to decode token:', error);
            return null;
        }
    }

    // Display user greeting
    function displayUserGreeting(username) {
        if (username) {
            userGreeting.textContent = `Welcome, ${username}!`;
        } else {
            userGreeting.textContent = 'Welcome!';
        }
    }

     // Fetch random recipes from Spoonacular and display them
     function fetchFeaturedRecipes() {
        fetch(`https://api.spoonacular.com/recipes/random?number=30&apiKey=${API_KEY}`)
            .then(response => response.json())
            .then(data => {
                const recipesWithImages = data.recipes.filter(recipe => recipe.image && recipe.image.trim() !== '');
                gridContainer.innerHTML = ''; // Clear existing content

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
                    gridContainer.appendChild(recipeCard);
                });

                attachViewDetailsEventListeners();
            })
            .catch(error => console.error('Error fetching recipes:', error));
    }

    // Fetch recipe details from Spoonacular and display them in a modal
    function fetchRecipeDetails(recipeId) {
        fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`)
            .then(response => response.json())
            .then(data => {
                const recipeModal = new bootstrap.Modal(document.getElementById('recipeModal'));
                const recipeTitle = document.getElementById('recipeTitle');
                const recipeDescription = document.getElementById('recipeDescription');
                const recipeIngredients = document.getElementById('recipeIngredients');
                const recipeInstructions = document.getElementById('recipeInstructions');

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

    // Attach event listeners for the "View Details" buttons
    function attachViewDetailsEventListeners() {
        document.querySelectorAll('.view-details').forEach(button => {
            button.addEventListener('click', function () {
                const recipeId = this.getAttribute('data-id');
                fetchRecipeDetails(recipeId);
            });
        });
    }

    // Event listeners for buttons
    createRecipeBtn.addEventListener('click', function () {
        window.location.href = './myrecipes.html'; // Navigate to My Recipes page
    });

    exploreRecipesBtn.addEventListener('click', function () {
        window.location.href = './explore.html'; // Navigate to Explore Recipes page
    });

    // Initialize user greeting
    const token = localStorage.getItem('token');
    if (token) {
        const userData = decodeToken(token);
        displayUserGreeting(userData?.username);
    } else {
        console.log("No token found, redirecting to login.");
        window.location.href = './login.html';
    }

    // Initialize other functions
    fetchFeaturedRecipes();
});

