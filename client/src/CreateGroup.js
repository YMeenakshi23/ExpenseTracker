import React, { useState } from 'react';
import axios from 'axios';

const CreateGroup = ({ userId, onGroupCreated }) => {
    const [groupName, setGroupName] = useState('');

    const handleCreate = async () => {
        if (!groupName) return;
        try {
            // Include created_by so the database doesn't record NULL
            await axios.post('http://localhost:5000/api/groups/create', { 
                name: groupName, 
                created_by: userId 
            });
            setGroupName('');
            // This triggers the handleRefresh function in App.js
            onGroupCreated(); 
            alert("Group created successfully!");
        } catch (err) {
            alert(err.response?.data?.message || "This group name is already taken.");
        }
    };

    return (
        <div style={{ padding: '10px' }}>
            <h4 style={{ margin: '0 0 10px 0' }}>Create a New Group</h4>
            <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                    type="text" 
                    placeholder="Group Name (e.g. Goa Trip)" 
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
                <button onClick={handleCreate} style={btnStyle}>Create</button>
            </div>
        </div>
    );
};

const btnStyle = { padding: '8px 15px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' };

export default CreateGroup;