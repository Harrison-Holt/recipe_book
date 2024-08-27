import jwt from 'jsonwebtoken'; 

export default function handler(req, res) {
    const auth_header = req.headers.authorization; 

    if(!auth_header) {
        return res.status(401).json({ valid: false, message: 'Authorization header missing'}); 
    }

    const token = auth_header.split(' ')[1]; 

    if(!token) {
        return res.status(401).json({ valid: false, message: 'Token missing'}); 
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        res.status(200).json({ valid: true, decoded: { userId: decoded.userId, username: decoded.username } });
    } catch(error) {
        res.status(401).json({ valid: false, message: 'Invalid token', error: error.message }); 
    }
}