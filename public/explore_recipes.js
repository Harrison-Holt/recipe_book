
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
        return; 
    } catch(error) {
        console.error('Internal Server Error: ', error);
    }
}

explore_recipes(); 