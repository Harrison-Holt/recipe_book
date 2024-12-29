import fetch from 'node-fetch';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv'; 

dotenv.config(); 

export const handler = async (event) => {
    let connection;
    try {
        // Connect to the MySQL RDS database
        connection = await mysql.createConnection({
            host: process.env.DB_HOST, 
            user: process.env.DB_USER,  
            password: process.env.DB_PASSWORD, 
            database: process.env.DB_NAME 
        });

        // Check if there are existing recipes
        const [existingRecipes] = await connection.execute(
            `SELECT * FROM daily_feature_recipes ORDER BY date_of_insertion DESC LIMIT 1`
        );

        if (existingRecipes.length > 0) {
            const lastRecipe = existingRecipes[0];
            const currentTime = new Date();
            const lastInsertedTime = new Date(lastRecipe.date_of_insertion);
            const timeDiff = (currentTime - lastInsertedTime) / (1000 * 60 * 60);  // Time difference in hours

            // If less than 24 hours have passed, return the existing recipes
            if (timeDiff < 24) {
                const [recipes] = await connection.execute(`SELECT * FROM daily_feature_recipes`);
                return {
                    statusCode: 200,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    },
                    body: JSON.stringify({
                        message: 'Returning existing recipes',
                        data: recipes // Return the current recipes to the frontend
                    })
                };
            }

            // If 24 hours have passed, remove all existing recipes
            await connection.execute(`DELETE FROM daily_feature_recipes`);
        }

        // Fetch 4 new random recipes from Spoonacular API
        const apiResponse = await fetch('https://api.spoonacular.com/recipes/random?number=4', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': '3a47a5cea1d54cc5a6c2b37bcd192723' 
            }
        });

        // Check if the API response is successful
        if (!apiResponse.ok) {
            console.log(`Connection Error: ${apiResponse.status}`);
            return {
                statusCode: apiResponse.status,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                },
                body: JSON.stringify({ message: 'Failed to fetch recipes' })
            };
        }

        // Parse the JSON data from the API response
        const data = await apiResponse.json();
        const recipes = data.recipes;  // Array of 4 recipes

        // Insert each of the 4 new recipes into the daily_feature_recipes table
        for (const recipe of recipes) {
            const { id: recipe_id, title, summary, image, instructions } = recipe;  // Extract recipe details

            // Insert the new recipe into the database
            await connection.execute(
                `INSERT INTO daily_feature_recipes (recipe_id, title, summary, image_url, instructions, date_of_insertion)
                 VALUES (?, ?, ?, ?, ?, NOW())`,
                [recipe_id, title, summary, image, instructions]  // Insert each recipe
            );
        }

        // Return success response with newly fetched recipes
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
            body: JSON.stringify({
                message: 'New recipes inserted successfully',
                data: recipes // Return the newly inserted recipes to the frontend
            })
        };

    } catch (error) {
        // Handle any errors
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
            body: JSON.stringify({ error: 'An error occurred while processing the request' })
        };
    } finally {
        // Ensure the connection is closed
        if (connection) {
            await connection.end();
        }
    }
};
