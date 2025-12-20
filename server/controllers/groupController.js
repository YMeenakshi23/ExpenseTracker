const db = require('../db');

exports.createGroup = async (req, res) => {
    const { name, created_by } = req.body;
    try {
        // 1. Insert the new group
        const [result] = await db.query('INSERT INTO expense_groups (name, created_by) VALUES (?, ?)', [name, created_by]);
        const groupId = result.insertId;

        // 2. CRITICAL: Automatically add the creator as the first member
        // This prevents the "No members found" error in your screenshots
        await db.query('INSERT INTO group_members (group_id, user_id) VALUES (?, ?)', [groupId, created_by]);

        res.status(201).json({ id: groupId, name });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getGroupMembers = async (req, res) => {
    const { groupId } = req.params;
    try {
        // Fetches names of everyone in the group for the member list display
        const [members] = await db.query(`
            SELECT u.id, u.name FROM users u 
            JOIN group_members gm ON u.id = gm.user_id 
            WHERE gm.group_id = ?`, [groupId]);
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addMember = async (req, res) => {
    const { groupId, email } = req.body;
    try {
        // 1. Find user by email
        const [user] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (user.length === 0) return res.status(404).json({ message: "User not found" });

        const userId = user[0].id;
        
        // 2. Check if already in group
        const [exists] = await db.query('SELECT * FROM group_members WHERE group_id = ? AND user_id = ?', [groupId, userId]);
        if (exists.length > 0) return res.status(400).json({ message: "User already in group" });

        // 3. Add them
        await db.query('INSERT INTO group_members (group_id, user_id) VALUES (?, ?)', [groupId, userId]);
        res.status(200).json({ message: "Member added!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserGroups = async (req, res) => {
    const { userId } = req.params;
    try {
        const [groups] = await db.query(`
            SELECT DISTINCT g.* FROM expense_groups g 
            LEFT JOIN group_members gm ON g.id = gm.group_id 
            WHERE g.created_by = ? OR gm.user_id = ?`, [userId, userId]);
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};