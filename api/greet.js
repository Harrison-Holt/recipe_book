
export default (req, res) => {
    const { name } = req.query;
    res.status(200).json({ message: `Hello, ${name}`});  
}; 