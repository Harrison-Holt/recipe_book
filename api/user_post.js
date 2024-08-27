import connect_database from "../config/db";
import bcrypt from 'bcryptjs'; 

export default async function post_handler(req, res) {

    if(req.method !== 'POST') {
        res.status(405).json({ message: 'Only POST request are allowed!'}); 
        return; 
    }

    const { name, password, email } = req.body; 

    if (!name || !password || !email) {
        res.status(400).json({ message: 'Name, password, email are required!'}); 
        return; 
    }
    
    try {
        const { connection, connected, error } = await connect_database();
    
        if (!connected) {
            console.log("Database connection failed:", error);
            res.status(500).json({ message: 'Database connection failed', error });
            return;
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const [result] = await connection.execute(
            'INSERT INTO users (name, password, email) VALUES (?, ?, ?)',
            [name, hashedPassword, email]
        );
    
        res.status(201).json({ message: 'User created successfully', userId: result.insertId });
    } catch (error) {
        console.error('Error during POST request processing:', error.message, error.stack);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
    