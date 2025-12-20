const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes'); 
const groupRoutes = require('./routes/groupRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const balanceRoutes = require('./routes/balanceRoutes');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes); 
app.use('/api/groups',groupRoutes);
app.use('/api/expenses',expenseRoutes);
app.use('/api/balances', balanceRoutes);


app.get('/', (req, res) => {
    res.send('ExpenseTracker API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});