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

    const recipes_container = document.getElementById('recipes_container'); 
    recipes_container.innerHTML = ''; 

    recipes.forEach(recipe => {
        const card = document.createElement('div'); 
        card.classList.add('card'); 

        card.innerHTML = `
        <img src=${recipe.image}>
        <h3>${recipe.title}</h3>
        <p>${recipe.summary}</p>`; 

        recipes_container.appendChild(card); 
    }); 
}
