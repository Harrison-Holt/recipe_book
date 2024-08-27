import connect_database from '../config/db.js';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    console.log("Request received:", req.method, req.body);

    if (req.method !== 'POST') {
        console.log("Invalid method:", req.method);
        res.status(405).json({ message: 'Only POST requests are allowed' });
        return;
    }

    const { name, password, email } = req.body;

    if (!name || !password || !email) {
        console.log("Missing fields:", { name, password, email });
        res.status(400).json({ message: 'Name, password, and email are required!' });
        return;
    }

    try {
        console.log("Attempting to connect to the database...");
        const { connection, connected, error } = await connect_database();

        if (!connected) {
            console.log("Database connection failed:", error);
            res.status(500).json({ message: 'Database connection failed', error });
            return;
        }

        console.log("Connected to the database. Hashing password...");
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log("Executing SQL query...");
        const [result] = await connection.execute(
            'INSERT INTO user (username, password, email) VALUES (?, ?, ?)',
            [name, hashedPassword, email]
        );

        console.log("SQL query executed successfully. Inserting user ID:", result.insertId);
        res.status(201).json({ message: 'User created successfully', userId: result.insertId });
    } catch (error) {
        console.error('Error occurred during request processing:', error.message, error.stack);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
