const db = require('../db');

exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    // Basic Validation
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please provide all fields" });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, password]
        );
        
        res.status(201).json({ 
            message: "User registered successfully", 
            userId: result.insertId 
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "Email already exists" });
        }
        res.status(500).json({ error: error.message });
    }
};
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.query(
            'SELECT * FROM users WHERE email = ? AND password = ?', 
            [email, password]
        );

        if (users.length > 0) {
            res.status(200).json({ 
                message: "Login successful", 
                user: { id: users[0].id, name: users[0].name } 
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
       // Return 401 (Unauthorized) instead of letting it crash
       return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    // ... generate token logic
    
  } catch (error) {
    // This logs the SPECIFIC error to your terminal
    console.error("Login Error:", error.message); 
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};