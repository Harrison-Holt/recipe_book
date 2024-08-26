
export default (req, res) => {
    const { name } = req.body;
    res.status(200).json({ message: `Hello, ${name}`});  
}; 