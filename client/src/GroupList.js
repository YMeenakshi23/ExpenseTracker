// client/src/GroupList.js
import React from 'react';

const GroupList = ({ groups, selectedGroup, groupMembers }) => {
    return (
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 15px 0' }}>📂 Group Members</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {groupMembers.map((m, i) => (
                    <li key={i} style={{ padding: '8px 0', borderBottom: '1px solid #f1f1f1', display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2ecc71', marginRight: '10px' }}></div>
                        {m.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GroupList;