import jwt from 'jsonwebtoken';

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
        const id = decoded.userId;

        const db = await connectToDatabase();

        const [results] = await db.query('DELETE FROM user WHERE id = ?', [id]);

        await db.end(); 

        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({ success: true, message: 'Account deleted successfully' });

    } catch (error) {
        console.error('Error:', error);
        return res.status(401).json({ success: false, message: 'Invalid token or database error', error: error.message });
    }
}
