import dotenv from 'dotenv'; 

dotenv.config(); 

export async function handler(event) {

    if(event.httpMethod !== 'GET') {
        return {
            statusCode: 405, 
            body: JSON.stringify({ message: 'Only GET Methods Allowed!'})
        }; 
    }

    try {

        const response = await fetch('https://api.spoonacular.com/recipes/informationBulk', {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json', 
                'X-API-KEY': process.env.API_KEY
            }
        }); 

        if(!response.ok) {
            console.error(`Internal Server Error! ${response.status}`);
            return {
                statusCode: 500, 
                body: JSON.stringify({ message: 'Internal Server Error!'})
            };        
        }

        const data = await response.json(); 
        console.log(data); 
        return {
            statusCode: 200, 
            body: JSON.stringify({ message: 'Successfully recieved recipes!'})
        };     
    } catch(error) {
        console.error('Internal Server Error', error); 
        return {
            statusCode: 500, 
            body: JSON.stringify({ message: 'Internal Server Error!'})
        };    
     }
}