const db = require('../db');

exports.createExpense = async (req, res) => {
    const { groupId, description, amount, category, paidBy, customSplits } = req.body;
    
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        // 1. Insert into expenses table
        // Ensure columns: group_id, description, total_amount, category, paid_by_id
        const [expenseResult] = await connection.query(
            'INSERT INTO expenses (group_id, description, total_amount, category, paid_by_id) VALUES (?, ?, ?, ?, ?)',
            [groupId, description, amount, category, paidBy]
        );
        const expenseId = expenseResult.insertId;

        // 2. Fetch all members in the group
        const [members] = await connection.query(
            'SELECT user_id FROM group_members WHERE group_id = ?',
            [groupId]
        );

        if (members.length === 0) throw new Error("No members found in this group.");

        // 3. Handle splits (Equal or Custom)
        for (let member of members) {
            let memberShare;
            if (customSplits && customSplits[member.user_id]) {
                memberShare = (amount * (parseFloat(customSplits[member.user_id]) / 100));
            } else {
                memberShare = amount / members.length;
            }

            await connection.query(
                'INSERT INTO expense_splits (expense_id, user_id, amount) VALUES (?, ?, ?)',
                [expenseId, member.user_id, memberShare]
            );
        }

        await connection.commit();
        res.status(201).json({ message: "Expense saved successfully!" });

    } catch (error) {
        await connection.rollback();
        console.error("DETAILED SQL ERROR:", error); // Check your VS Code terminal for this!
        res.status(500).json({ message: "Database Error: " + error.message });
    } finally {
        connection.release();
    }
};
exports.settleDebt = async (req, res) => {
    const { payerId, creditorName } = req.body;
    try {
        // Find the creditor's ID by their name
        const [user] = await db.query('SELECT id FROM users WHERE name = ?', [creditorName]);
        if (user.length === 0) return res.status(404).json({ message: "Creditor not found" });
        
        const creditorId = user[0].id;

        // "Settling" in this app means removing the splits between these two people
        // This query clears debts where payerId owes creditorId
        await db.query(`
            DELETE FROM expense_splits 
            WHERE user_id = ? AND expense_id IN (
                SELECT id FROM expenses WHERE paid_by_id = ?
            )`, [payerId, creditorId]);

        res.status(200).json({ message: "Debt settled!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};