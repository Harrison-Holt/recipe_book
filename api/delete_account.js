import jwt from 'jsonwebtoken';
import connect_database from '../config/db.js';

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ success: false, message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const id = decoded.id;

        // Correctly destructuring the returned object from connect_database
        const { connection, connected, error } = await connect_database();

        // Check if the database connection was successful
        if (!connected) {
            console.error('Database connection error:', error);
            return res.status(500).json({ success: false, message: 'Database connection failed', error });
        }

        // Execute the delete query
        const [results] = await connection.query('DELETE FROM user WHERE id = ?', [id]);

        // Close the database connection
        await connection.end(); 

        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({ success: true, message: 'Account deleted successfully' });

    } catch (error) {
        console.error('Error:', error);
        return res.status(401).json({ success: false, message: 'Invalid token or database error', error: error.message });
    }
}
