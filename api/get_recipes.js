import connect_database from '../config/db.js';

// Get User Recipes API
export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { user_id } = req.query; 

    if (!user_id) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    try {
        const { connection, connected, error } = await connect_database();

        if (!connected) {
            console.error('Database connection error:', error);
            return res.status(500).json({ success: false, message: 'Database connection failed', error });
        }

        // Query to get all recipes for the user
        const [rows] = await connection.query(
            `SELECT id, title, image_url, description, ingredients, instructions, source_id, is_user_created, created_at 
             FROM user_recipes 
             WHERE user_id = ?`,
            [user_id]
        );

        await connection.end();

        // Format ingredients from JSON if necessary
        const formattedRecipes = rows.map(recipe => ({
            ...recipe,
            ingredients: JSON.parse(recipe.ingredients) // Convert JSON string back to an array
        }));

        return res.status(200).json({ success: true, recipes: formattedRecipes });

    } catch (error) {
        console.error('Error fetching recipes:', error);
        return res.status(500).json({ success: false, message: 'Error fetching recipes', error: error.message });
    }
}
