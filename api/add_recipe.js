import connect_database from '../config/db.js';

// Add Recipe API
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { userId, title, image_url, description, ingredients, instructions, source_id, is_user_created } = req.body;

    // Basic validation
    if (!userId || !title || !ingredients || !instructions) {
        console.error('Validation failed. Missing required fields:', { userId, title, ingredients, instructions });
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    try {
        const { connection, connected, error } = await connect_database();

        if (!connected) {
            console.error('Database connection error:', error);
            return res.status(500).json({ success: false, message: 'Database connection failed', error });
        }

        // Construct the SQL query
        const query = `INSERT INTO recipes (user_id, title, ${image_url ? 'image_url,' : ''} description, ingredients, instructions, source_id, is_user_created) 
                       VALUES (?, ?, ${image_url ? '?' : ''} ?, ?, ?, ?, ?)`;

        const values = [userId, title];
        if (image_url) values.push(image_url);
        values.push(description, JSON.stringify(ingredients), instructions, source_id, is_user_created);

        // Execute the query
        const [result] = await connection.query(query, values);

        await connection.end();

        return res.status(201).json({ success: true, message: 'Recipe added successfully', recipeId: result.insertId });

    } catch (error) {
        console.error('Error adding recipe:', error);
        return res.status(500).json({ success: false, message: 'Error adding recipe', error: error.message });
    }
}
