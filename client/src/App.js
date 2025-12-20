import React, { useState } from 'react';
import Home from './Home';
import Auth from './Auth';
import Dashboard from './Dashboard';
import AddExpense from './AddExpense';
import CreateGroup from './CreateGroup';
import AddMember from './AddMember';

function App() {
  // 1. Initialize user from LocalStorage to keep session on refresh
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser && savedUser !== "undefined") {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [showAuth, setShowAuth] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => setRefreshKey(prev => prev + 1);

  // 2. Handle Login: Save to state AND localStorage
  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setShowAuth(false);
  };

  // 3. Handle Logout: Clear state AND localStorage
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setShowAuth(false);
  };

  // VIEW 1: If user is logged in, ONLY show the Dashboard view
  if (user) {
    return (
      <div style={styles.pageWrapper}>
        <div style={styles.container}>
          <header style={styles.dashboardHeader}>
            <div style={styles.brand}>
              <span style={styles.logoIcon}>📊</span>
              <h1 style={styles.logoText}>ExpenseShare</h1>
            </div>
            <div style={styles.userProfile}>
              <span style={styles.welcomeText}>Hi, <strong>{user.name}</strong></span>
              <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </div>
          </header>

          <Dashboard key={refreshKey} userId={user.id} />

          <div style={styles.mainGrid}>
            <div style={styles.primaryColumn}>
              <AddExpense currentUser={user} onExpenseAdded={handleRefresh} refreshTrigger={refreshKey} />
            </div>
            <div style={styles.sidebar}>
              <div style={styles.sidebarSection}>
                <CreateGroup userId={user.id} onGroupCreated={handleRefresh} />
              </div>
              <div style={styles.sidebarSection}>
                <AddMember currentUser={user} refreshTrigger={refreshKey} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // VIEW 2: If user clicked "Get Started", ONLY show Auth
  if (showAuth) {
    return (
      <div style={styles.authWrapper}>
        <button onClick={() => setShowAuth(false)} style={styles.backBtn}>← Back</button>
        <Auth onLogin={handleLogin} />
      </div>
    );
  }

  // VIEW 3: Default view is ONLY the Home page
  return <Home onStart={() => setShowAuth(true)} />;
}

const styles = {
    pageWrapper: { backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px', fontFamily: "'Inter', sans-serif" },
    container: { maxWidth: '1200px', margin: '0 auto' },
    dashboardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '15px 30px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '25px' },
    brand: { display: 'flex', alignItems: 'center', gap: '10px' },
    logoIcon: { fontSize: '1.8rem' },
    logoText: { margin: 0, color: '#1a1a1a', fontSize: '1.4rem', fontWeight: '800' },
    welcomeText: { color: '#636e72', marginRight: '15px' },
    logoutBtn: { padding: '8px 18px', backgroundColor: '#fff', color: '#ff7675', border: '2px solid #ff7675', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    mainGrid: { display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '25px' },
    primaryColumn: { display: 'flex', flexDirection: 'column' },
    sidebar: { display: 'flex', flexDirection: 'column', gap: '25px' },
    sidebarSection: { backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', padding: '20px' }, // Added padding
    authWrapper: { backgroundColor: '#f0f2f5', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' },
    backBtn: { position: 'absolute', top: '20px', left: '20px', background: 'none', border: 'none', color: '#3498db', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }
};

export default App;