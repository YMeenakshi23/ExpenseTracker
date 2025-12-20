import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Dashboard = ({ userId }) => {
    const [summary, setSummary] = useState({ netBalance: 0, totalPaid: 0 });
    const [credits, setCredits] = useState([]);
    const [debts, setDebts] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadDashboard = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const [sum, cre, deb] = await Promise.all([
                axios.get(`http://localhost:5000/api/balances/${userId}`).catch(() => ({ data: { netBalance: 0, totalPaid: 0 } })),
                axios.get(`http://localhost:5000/api/balances/dues/${userId}`).catch(() => ({ data: [] })),
                axios.get(`http://localhost:5000/api/balances/debts/${userId}`).catch(() => ({ data: [] }))
            ]);
            setSummary(sum.data);
            setCredits(cre.data);
            setDebts(deb.data);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => { loadDashboard(); }, [loadDashboard]);

    const handleSettle = async (creditorName) => {
        if (window.confirm(`Mark all debts to ${creditorName} as settled?`)) {
            try {
                await axios.post('http://localhost:5000/api/expenses/settle', {
                    payerId: userId,
                    creditorName: creditorName
                });
                loadDashboard(); 
            } catch (err) {
                alert("Error settling debt");
            }
        }
    };

    if (loading) return <div style={loaderStyle}>Calculating balances...</div>;

    return (
        <div style={{ marginBottom: '30px' }}>
            <div style={topGrid}>
                <div style={cardStyle}>
                    <p style={labelStyle}>Net Balance</p>
                    <h2 style={{ color: (summary?.netBalance || 0) >= 0 ? '#27ae60' : '#e74c3c', margin: 0 }}>
                        ${Math.abs(summary?.netBalance || 0).toFixed(2)}
                    </h2>
                </div>
                <div style={cardStyle}>
                    <p style={labelStyle}>Total Spending</p>
                    <h2 style={{ color: '#2980b9', margin: 0 }}>${(summary?.totalPaid || 0).toFixed(2)}</h2>
                </div>
            </div>
            
            <div style={mainGrid}>
                <div style={cardStyle}>
                    <h4 style={{ ...headerStyle, color: '#27ae60' }}>Owed to You</h4>
                    {credits.length > 0 ? credits.map((c, i) => (
                        <div key={i} style={itemStyle}>
                            <span>{c.name}</span>
                            <span style={{ color: '#27ae60', fontWeight: 'bold' }}>+${parseFloat(c.amountOwed || 0).toFixed(2)}</span>
                        </div>
                    )) : <p style={emptyText}>No one owes you.</p>}
                </div>
                <div style={cardStyle}>
                    <h4 style={{ ...headerStyle, color: '#e74c3c' }}>You Owe</h4>
                    {debts.length > 0 ? debts.map((d, i) => (
                        <div key={i} style={itemStyle}>
                            <span>{d.creditorName}</span>
                            <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>-${parseFloat(d.amountIOwe || 0).toFixed(2)}</span>
                                <button onClick={() => handleSettle(d.creditorName)} style={settleBtnStyle}>Settle</button>
                            </div>
                        </div>
                    )) : <p style={emptyText}>Settled up!</p>}
                </div>
            </div>
        </div>
    );
};

const cardStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' };
const topGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' };
const mainGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' };
const labelStyle = { margin: '0 0 5px 0', color: '#95a5a6', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' };
const headerStyle = { margin: '0 0 15px 0', fontSize: '1rem' };
const itemStyle = { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f2f6' };
const emptyText = { color: '#bdc3c7', fontSize: '0.9rem', textAlign: 'center', marginTop: '10px' };
const loaderStyle = { padding: '50px', textAlign: 'center', fontSize: '1.2rem', color: '#7f8c8d' };
const settleBtnStyle = { padding: '4px 8px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' };

export default Dashboard;