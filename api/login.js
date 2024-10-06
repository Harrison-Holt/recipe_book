import connect_database from '../config/db.js';
import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken'; 

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(405).json({ message: 'Only GET requests are allowed' });
        return;
    }

    const { username_or_email, password } = req.query;

    if (!username_or_email || !password) {
        res.status(400).json({ message: 'Username/Email and Password is required!' });
        return;
    }

    try {
        const { connection, connected, error } = await connect_database();

        if (!connected) {
            res.status(500).json({ message: 'Database connection failed', error });
            return;
        }

        let query = 'SELECT * FROM accounts WHERE ';
        const params = [];

        if (username_or_email.includes('@')) {
            query += 'email = ?';
        } else {
            query += 'username = ?';
        }
        params.push(username_or_email);


        const [rows] = await connection.execute(query, params);

        if (rows.length === 0) {
            res.status(404).json({ message: 'User not found' });
        } else {
            const user = rows[0]; 

            const is_match = await bcrypt.compare(password, user.password)

            if(is_match) {
                const token = jwt.sign({username_or_email}, process.env.JWT_SECRET, {
                    expiresIn: '1h'
                }); 
                res.status(200).json({ message: 'Login Successful!', token})
            } else {

                res.status(401).json({ message: 'Invalid username/email and/or password!'}); 
            }
        }


    } catch (error) {
        console.error('Error occurred during request processing:', error.message, error.stack);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
