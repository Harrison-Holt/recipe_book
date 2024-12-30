
// fetch random list of the currents recipes available 
async function explore_recipes() {

    try {
        const response = await fetch('https://n36fgwwnf1.execute-api.us-east-1.amazonaws.com/prod/explore_recipes'); 

        if(!response.ok) {
            console.log(`Error Fetching Recipes! Response Status: ${response.status}`); 
            return; 
        }

        const data = await response.json(); 
        console.log(data); 
        const title = data.data.recipes[0].title; 
        console.log(title); 

        const recipes = data.data.recipes; 
        render_cards(recipes); 
        return data; 
    } catch(error) {
        console.error('Internal Server Error: ', error);
    }
}

function render_cards(recipes) {

    const container = document.getElementById('recipes_section'); 
    container.innerHTML = ''; 

    recipes.forEach(recipes => {
        const card = document.createElement('div'); 
    card.innerHTML = `
    <img src="${recipes.image}>
    <h3>${recipes.title}</h3>
    <p>${recipes.summary}</p>`; 

    container.appendChild(card); 
    }); 
}
