const db = require('../db');

// 1. Get Overall Summary (Total Paid, Total Owed, Net Balance)
exports.getUserBalance = async (req, res) => {
    const { userId } = req.params;
    try {
        // Calculate Total Paid by the user
        const [paidResult] = await db.query(
            'SELECT SUM(total_amount) as totalPaid FROM expenses WHERE paid_by_id = ?',
            [userId]
        );

        // Calculate Total Owed by the user (their share in splits)
        const [owedResult] = await db.query(
            'SELECT SUM(amount) as totalOwed FROM expense_splits WHERE user_id = ?',
            [userId]
        );

        const totalPaid = parseFloat(paidResult[0].totalPaid || 0);
        const totalOwed = parseFloat(owedResult[0].totalOwed || 0);
        const netBalance = totalPaid - totalOwed;

        res.status(200).json({
            userId,
            totalPaid,
            totalOwed,
            netBalance,
            message: netBalance >= 0 ? "You are owed" : "You owe"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Get Credits (People who owe YOU money)
exports.getIndividualDues = async (req, res) => {
    const { userId } = req.params;
    try {
        const [dues] = await db.query(`
            SELECT 
                u.name, 
                SUM(es.amount) as amountOwed 
            FROM expense_splits es
            JOIN expenses e ON es.expense_id = e.id
            JOIN users u ON es.user_id = u.id
            WHERE e.paid_by_id = ? AND es.user_id != ?
            GROUP BY u.id
        `, [userId, userId]);

        res.status(200).json(dues);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Get Debts (People YOU owe money to)
exports.getIndividualDebts = async (req, res) => {
    const { userId } = req.params;
    try {
        const [debts] = await db.query(`
            SELECT 
                u.name as creditorName, 
                SUM(es.amount) as amountIOwe 
            FROM expense_splits es
            JOIN expenses e ON es.expense_id = e.id
            JOIN users u ON e.paid_by_id = u.id
            WHERE es.user_id = ? AND e.paid_by_id != ?
            GROUP BY e.paid_by_id
        `, [userId, userId]);

        res.status(200).json(debts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.settleDebt = async (req, res) => {
    const { payerId, creditorName } = req.body; // Ensure you are receiving creditorName
    try {
        // We first need the creditor's ID based on their name
        const [creditor] = await db.query('SELECT id FROM users WHERE name = ?', [creditorName]);
        
        if (creditor.length === 0) return res.status(404).json({ message: "Creditor not found" });
        const creditorId = creditor[0].id;

        // DELETE the splits where the current user (payerId) owes the creditor
        await db.query(`
            DELETE es FROM expense_splits es
            JOIN expenses e ON es.expense_id = e.id
            WHERE es.user_id = ? AND e.paid_by_id = ?
        `, [payerId, creditorId]);

        res.status(200).json({ message: "Debt settled!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getSimplifiedBalances = async (req, res) => {
    const { groupId } = req.params;
    try {
        // 1. Get the net balance for every user in the group
        const [netBalances] = await db.query(`
            SELECT 
                u.id, 
                u.name,
                (IFNULL(paid_sums.total_paid, 0) - IFNULL(owed_sums.total_owed, 0)) as net_amount
            FROM users u
            JOIN group_members gm ON u.id = gm.user_id
            LEFT JOIN (
                SELECT paid_by_id, SUM(total_amount) as total_paid 
                FROM expenses WHERE group_id = ? GROUP BY paid_by_id
            ) paid_sums ON u.id = paid_sums.paid_by_id
            LEFT JOIN (
                SELECT es.user_id, SUM(es.amount) as total_owed 
                FROM expense_splits es
                JOIN expenses e ON es.expense_id = e.id
                WHERE e.group_id = ? GROUP BY es.user_id
            ) owed_sums ON u.id = owed_sums.user_id
            WHERE gm.group_id = ?
        `, [groupId, groupId, groupId]);

        // 2. Separate into Debtors and Creditors
        let debtors = netBalances.filter(u => u.net_amount < -0.01).sort((a, b) => a.net_amount - b.net_amount);
        let creditors = netBalances.filter(u => u.net_amount > 0.01).sort((a, b) => b.net_amount - a.net_amount);

        let transactions = [];

        // 3. Greedy algorithm to match Debtors to Creditors
        let i = 0, j = 0;
        while (i < debtors.length && j < creditors.length) {
            let oweAmount = Math.abs(debtors[i].net_amount);
            let receiveAmount = creditors[j].net_amount;
            let settledAmount = Math.min(oweAmount, receiveAmount);

            transactions.push({
                from: debtors[i].name,
                to: creditors[j].name,
                amount: settledAmount.toFixed(2)
            });

            debtors[i].net_amount += settledAmount;
            creditors[j].net_amount -= settledAmount;

            if (Math.abs(debtors[i].net_amount) < 0.01) i++;
            if (creditors[j].net_amount < 0.01) j++;
        }

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};