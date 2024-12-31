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
        console.log(data); 

        return data; 

    } catch(error) {
        console.error('Error fetching data! Error: ', error); 
    }
}

get_daily_recipes(); 
// Call restrict access function to check if the user is logged in
restrictAccess();


