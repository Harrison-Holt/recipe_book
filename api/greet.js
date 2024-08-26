
export default (rep, res) => {
    const { name } = rep.body;
    res.status(200).json({ message: `Hello, ${name}`});  
}; 