async function get_daily_recipes() {

    try {
        const response = await fetch('https://n36fgwwnf1.execute-api.us-east-1.amazonaws.com/prod/daily_recipes', {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json'
            }
        }); 

        if(!response.ok) {
            console.error(`Error fetching data! ${response.status}`); 
            return; 
        }

        const data = await response.json(); 
        const recipes = data.data.recipes; 

        console.log(data); 
        render_daily_recipes(recipes); 
        return data; 

    } catch(error) {
        console.error('Error fetching data! Error: ', error); 
    }
}

get_daily_recipes(); 


function render_daily_recipes(recipes) {
    const container = document.getElementById('recipes_container');
    container.innerHTML = ''; // Clear existing content

    recipes.forEach((recipe, index) => {
        // Create a new row for every 2 cards
        if (index % 2 === 0) {
            var row = document.createElement('div');
            row.classList.add('row', 'gy-4', 'justify-content-center'); // Add spacing between rows
            container.appendChild(row);
        }

        // Create the card column
        const col = document.createElement('div');
        col.classList.add('col-md-6', 'd-flex', 'justify-content-center'); // 2 columns per row on medium+ screens

        // Create the card
        const card = document.createElement('div');
        card.classList.add('card', 'shadow-sm', 'w-100', 'recipe-card');
        card.style.maxWidth = '18rem';

        card.innerHTML = `
            <img src="${recipe.image || 'https://via.placeholder.com/300x200'}" class="card-img-top" alt="${recipe.title || 'Recipe Image'}">
            <div class="card-body">
                <h5 class="card-title">${recipe.title || 'No Title'}</h5>
                <p class="card-text">${recipe.summary ? recipe.summary.replace(/<\/?[^>]+(>|$)/g, "") : 'No summary available.'}</p>
                <a href="${recipe.sourceUrl || '#'}" class="btn btn-primary">View Recipe</a>
            </div>
        `;

        col.appendChild(card);
        row.appendChild(col);
    });
}

