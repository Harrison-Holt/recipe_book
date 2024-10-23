import fetch from 'node-fetch';

exports.handler = async (event) => {
    try {

        // Call the Spoonacular API
        const response = await fetch('https://api.spoonacular.com/recipes/random', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': '3a47a5cea1d54cc5a6c2b37bcd192723'
            }
        });

        // Check if the response is successful
        if (!response.ok) {
            console.log(`Connection Error: ${response.status}`);
            return {
                statusCode: response.status,
                body: JSON.stringify({ message: 'Failed to fetch recipe' })
            };
        }

        // Parse the JSON data
        const data = await response.json();

        // Return the data from the API call
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };

    } catch (error) {
        console.error("Error fetching data: ", error);

        // Return an error response in case of failure
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error fetching recipe', error: error.message }),
        };
    }
};
