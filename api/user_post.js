import connect_database from '../config/db.js'; 
import bcrypt from 'bcryptjs'; 

export default async function handler(req, res) {

    if(req.method !== 'POST') {
        res.status(405).json({ message: 'Only POST request are allowed'}); 
        return; 
    }

    const { name, password, email } = req.body; 

    if(!name || !password || !email) {
        res.status(400).json({ message: 'Name, password, email are required!'});
        return;  
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const db = await connect_database();
    
        const [result] = await db.execute(
            'INSERT INTO users (name, password, email) VALUES (?, ?, ?)',
            [name, hashedPassword, email]
        );
    
        res.status(201).json({ message: 'User created successfully', userId: result.insertId });
    } catch (error) {
        console.error('Error inserting user data: ', error);
    
        // Return the error as JSON
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}    