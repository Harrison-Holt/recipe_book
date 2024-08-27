import connect_database from '../config/db.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(405).json({ message: 'Only GET requests are allowed' });
        return;
    }

    const { id, email } = req.query;

    if (!id && !email) {
        res.status(400).json({ message: 'User ID or email is required!' });
        return;
    }

    try {
        const { connection, connected, error } = await connect_database();

        if (!connected) {
            res.status(500).json({ message: 'Database connection failed', error });
            return;
        }

        let query = 'SELECT * FROM user WHERE ';
        const params = [];

        if (id) {
            query += 'id = ?';
            params.push(id);
        } else if (email) {
            query += 'email = ?';
            params.push(email);
        }

        const [rows] = await connection.execute(query, params);

        if (rows.length === 0) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.status(200).json({ user: rows[0] });
        }
    } catch (error) {
        console.error('Error occurred during request processing:', error.message, error.stack);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
