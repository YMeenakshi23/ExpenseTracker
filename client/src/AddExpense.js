import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddExpense = ({ currentUser, onExpenseAdded, refreshTrigger }) => {
    const [groups, setGroups] = useState([]);
    const [members, setMembers] = useState([]);
    const [percentages, setPercentages] = useState({});
    const [formData, setFormData] = useState({
        groupId: '',
        description: '',
        amount: '',
        category: 'Food',
        splitType: 'Equally'
    });

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/groups/user/${currentUser.id}`);
                setGroups(res.data);
                if (res.data.length > 0) setFormData(prev => ({ ...prev, groupId: res.data[0].id }));
            } catch (err) { console.error(err); }
        };
        fetchGroups();
    }, [currentUser.id, refreshTrigger]);

    useEffect(() => {
        const fetchMembers = async () => {
            if (!formData.groupId) return;
            try {
                const res = await axios.get(`http://localhost:5000/api/groups/${formData.groupId}/members`);
                setMembers(res.data);
                
                // Set initial equal percentages
                const initialPerc = {};
                const equalShare = (100 / res.data.length).toFixed(2);
                res.data.forEach(m => initialPerc[m.id] = equalShare);
                setPercentages(initialPerc);
            } catch (err) { console.error(err); }
        };
        fetchMembers();
    }, [formData.groupId]);

    const handlePercentageChange = (userId, value) => {
        setPercentages(prev => ({ ...prev, [userId]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.splitType === 'Percentage') {
            const total = Object.values(percentages).reduce((sum, val) => sum + parseFloat(val || 0), 0);
            if (Math.round(total) !== 100) {
                alert(`Total must be 100%. Current: ${total}%`);
                return;
            }
        }

        try {
            await axios.post('http://localhost:5000/api/expenses/add', {
                ...formData,
                paidBy: currentUser.id,
                customSplits: percentages // Send percentage map
            });
            alert("Expense Added!");
            onExpenseAdded();
            setFormData({ ...formData, description: '', amount: '' });
        } catch (err) {
            alert(err.response?.data?.message || "Error saving expense");
        }
    };

    return (
        <div style={containerStyle}>
            <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>💸 New Expense</h3>
            <form onSubmit={handleSubmit}>
                <div style={formRow}>
                    <div style={inputBox}>
                        <label style={labelStyle}>Group</label>
                        <select style={inputStyle} value={formData.groupId} onChange={e => setFormData({...formData, groupId: e.target.value})}>
                            {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                        </select>
                    </div>
                    <div style={inputBox}>
                        <label style={labelStyle}>Category</label>
                        <select style={inputStyle} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                            <option value="Food">🍔 Food</option>
                            <option value="Travel">🚗 Travel</option>
                            <option value="Shopping">🛍️ Shopping</option>
                            <option value="Rent">🏠 Rent</option>
                            <option value="Other">✨ Other</option>
                        </select>
                    </div>
                </div>

                <div style={formRow}>
                    <div style={inputBox}>
                        <label style={labelStyle}>Split Type</label>
                        <select style={inputStyle} value={formData.splitType} onChange={e => setFormData({...formData, splitType: e.target.value})}>
                            <option value="Equally">Exact & Equal</option>
                            <option value="Percentage">Percentage (%)</option>
                        </select>
                    </div>
                    <div style={inputBox}>
                        <label style={labelStyle}>Total Amount ($)</label>
                        <input style={inputStyle} type="number" placeholder="0.00" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
                    </div>
                </div>

                <div style={previewSection}>
                    <p style={labelStyle}>Split Preview:</p>
                    {members.map(m => {
                        const amt = formData.splitType === 'Equally' 
                            ? (formData.amount / members.length) 
                            : (formData.amount * (percentages[m.id] / 100));
                        return (
                            <div key={m.id} style={previewRow}>
                                <span>{m.name}</span>
                                <div style={{display:'flex', gap:'10px'}}>
                                    {formData.splitType === 'Percentage' && (
                                        <input type="number" style={percInput} value={percentages[m.id]} onChange={e => handlePercentageChange(m.id, e.target.value)} />
                                    )}
                                    <b>${(amt || 0).toFixed(2)}</b>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div style={inputBox}>
                    <label style={labelStyle}>Description</label>
                    <input style={inputStyle} type="text" placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                </div>
                <button type="submit" style={btnStyle}>Submit Expense</button>
            </form>
        </div>
    );
};

const containerStyle = { backgroundColor: '#fff', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' };
const formRow = { display: 'flex', gap: '15px', marginBottom: '5px' };
const inputBox = { display: 'flex', flexDirection: 'column', gap: '5px', flex: 1, marginBottom: '15px' };
const labelStyle = { fontSize: '0.8rem', fontWeight: 'bold', color: '#95a5a6' };
const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #dfe6e9' };
const btnStyle = { width: '100%', padding: '14px', backgroundColor: '#27ae60', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };
const previewSection = { backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '10px', marginBottom: '15px' };
const previewRow = { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' };
const percInput = { width: '50px', border: '1px solid #ddd', borderRadius: '4px', textAlign: 'center' };

export default AddExpense;