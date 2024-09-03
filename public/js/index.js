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

    // Fetch all recipes and display them
    function fetchAllRecipes() {
        fetch('/api/recipes') // Adjust the endpoint based on your backend setup
            .then(response => response.json())
            .then(data => {
                data.forEach(recipe => {
                    const recipeItem = document.createElement('div');
                    recipeItem.classList.add('grid-item');
                    recipeItem.textContent = recipe.title; // Adjust as needed
                    gridContainer.appendChild(recipeItem);
                });
            })
            .catch(error => console.error('Error fetching recipes:', error));
    }

    // Fetch daily featured recipe and display it
    function fetchDailyFeaturedRecipe() {
        fetch('/api/featured-recipe') // Adjust the endpoint
            .then(response => response.json())
            .then(data => {
                gridContainer.innerHTML = ''; // Clear existing content
                const dailyRecipe = document.createElement('div');
                dailyRecipe.classList.add('grid-item');
                dailyRecipe.textContent = data.title; // Adjust as needed
                gridContainer.appendChild(dailyRecipe);
            })
            .catch(error => console.error('Error fetching daily recipe:', error));
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
    fetchAllRecipes();
    fetchDailyFeaturedRecipe();
});

