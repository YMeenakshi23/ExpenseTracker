import React from 'react';

const Home = ({ onStart }) => {
    return (
        <div style={styles.container}>
            {/* HERO SECTION */}
            <section style={styles.hero}>
                <div style={styles.heroContent}>
                    <h1 style={styles.heroTitle}>Effortless Expense Splitting for Friends & Teams</h1>
                    <p style={styles.heroSubtitle}>
                        Stop stressing about who owes who. Track group bills, manage roommates, 
                        and settle up with ease—all in one place.
                    </p>
                    <button onClick={onStart} style={styles.ctaButton}>Get Started for Free</button>
                </div>
                <div style={styles.heroImageContainer}>
                    {/* Placeholder for Hero Image */}
                    <img 
                        src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80" 
                        alt="Friends hanging out" 
                        style={styles.heroImage}
                    />
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section style={styles.features}>
                <h2 style={styles.sectionTitle}>Why Choose ExpenseShare?</h2>
                <div style={styles.featureGrid}>
                    <div style={styles.featureCard}>
                        <span style={styles.icon}>📊</span>
                        <h3>Smart Dashboard</h3>
                        <p>Get a bird's eye view of your net balance across all your groups instantly.</p>
                    </div>
                    <div style={styles.featureCard}>
                        <span style={styles.icon}>👥</span>
                        <h3>Group Management</h3>
                        <p>Create groups for trips, housemates, or events and invite members via email.</p>
                    </div>
                    <div style={styles.featureCard}>
                        <span style={styles.icon}>💸</span>
                        <h3>Quick Settle</h3>
                        <p>Record payments and clear debts with a single click. No more awkward reminders.</p>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer style={styles.footer}>
                <p>© 2025 ExpenseShare. Built for better friendships.</p>
            </footer>
        </div>
    );
};

const styles = {
    container: { fontFamily: "'Inter', sans-serif", color: '#2d3436', backgroundColor: '#fff' },
    hero: { 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
        padding: '80px 10%', gap: '50px', backgroundColor: '#f9f9f9' 
    },
    heroContent: { flex: 1 },
    heroTitle: { fontSize: '3rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '20px', color: '#1a1a1a' },
    heroSubtitle: { fontSize: '1.2rem', color: '#636e72', marginBottom: '30px', lineHeight: '1.6' },
    ctaButton: { 
        padding: '15px 35px', backgroundColor: '#3498db', color: '#fff', 
        border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' 
    },
    heroImageContainer: { flex: 1 },
    heroImage: { width: '100%', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' },
    features: { padding: '80px 10%', textAlign: 'center' },
    sectionTitle: { fontSize: '2.2rem', marginBottom: '50px' },
    featureGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '30px' },
    featureCard: { padding: '30px', borderRadius: '15px', backgroundColor: '#fff', border: '1px solid #eee' },
    icon: { fontSize: '2.5rem', marginBottom: '20px', display: 'block' },
    footer: { padding: '40px', textAlign: 'center', backgroundColor: '#1a1a1a', color: '#fff' }
};

export default Home;