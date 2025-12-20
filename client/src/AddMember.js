import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddMember = ({ currentUser, refreshTrigger }) => {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                // Fetch groups belonging to the user
                const res = await axios.get(`http://localhost:5000/api/groups/user/${currentUser.id}`);
                setGroups(res.data);
                if (res.data.length > 0) setSelectedGroup(res.data[0].id);
            } catch (err) {
                console.error("Error fetching groups:", err);
            }
        };
        fetchGroups();
    }, [currentUser.id, refreshTrigger]); // refreshTrigger makes the dropdown update instantly

    const handleAddMember = async () => {
    if (!email || !selectedGroup) return;
    try {
        // Updated URL to include '/groups'
        await axios.post('http://localhost:5000/api/groups/add-member', { 
            groupId: selectedGroup, 
            email: email 
        });
        alert("Member added successfully!");
        setEmail('');
    } catch (err) {
        // This will now correctly show the backend's "User not found" message
        alert(err.response?.data?.message || "An error occurred");
    }
};

    return (
        <div style={{ padding: '10px' }}>
            <h4 style={{ margin: '0 0 10px 0' }}>Invite Members</h4>
            <div style={{ display: 'flex', gap: '5px' }}>
                <select 
                    value={selectedGroup} 
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    style={{ padding: '8px', borderRadius: '4px' }}
                >
                    {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
                <input 
                    type="email" 
                    placeholder="Friend's Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <button onClick={handleAddMember} style={addBtnStyle}>Add to Group</button>
            </div>
        </div>
    );
};

const addBtnStyle = { padding: '8px 12px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' };

export default AddMember;