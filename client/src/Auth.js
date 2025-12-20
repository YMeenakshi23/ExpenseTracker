import React, { useState } from 'react';
import axios from 'axios';

const Auth = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const url = isLogin ? 'login' : 'register';
        try {
            const res = await axios.post(`http://localhost:5000/api/users/${url}`, formData);
            if (isLogin) {
                onLogin(res.data.user);
            } else {
                alert("Account created successfully! Please login.");
                setIsLogin(true);
            }
        } catch (err) {
            alert(err.response?.data?.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h2 style={styles.title}>{isLogin ? 'Welcome Back' : 'Join ExpenseShare'}</h2>
                    <p style={styles.subtitle}>
                        {isLogin ? 'Enter your details to manage your group bills' : 'Start splitting expenses with friends today'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    {!isLogin && (
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Full Name</label>
                            <input 
                                style={styles.input}
                                type="text" 
                                placeholder="John Doe" 
                                onChange={e => setFormData({...formData, name: e.target.value})} 
                                required 
                            />
                        </div>
                    )}
                    
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input 
                            style={styles.input}
                            type="email" 
                            placeholder="name@company.com" 
                            onChange={e => setFormData({...formData, email: e.target.value})} 
                            required 
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input 
                            style={styles.input}
                            type="password" 
                            placeholder="••••••••" 
                            onChange={e => setFormData({...formData, password: e.target.value})} 
                            required 
                        />
                    </div>

                    <button type="submit" disabled={loading} style={styles.button}>
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                <div style={styles.footer}>
                    <p style={styles.footerText}>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <span 
                            style={styles.toggleLink} 
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin ? ' Register here' : ' Login here'}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

// Modern CSS-in-JS Styles
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f4f7f6', // Light grayish-green background
        padding: '20px'
    },
    card: {
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
    },
    header: {
        marginBottom: '30px'
    },
    title: {
        margin: '0 0 10px 0',
        color: '#2d3436',
        fontSize: '1.8rem',
        fontWeight: '700'
    },
    subtitle: {
        color: '#636e72',
        fontSize: '0.9rem',
        margin: 0
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        textAlign: 'left'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px'
    },
    label: {
        fontSize: '0.85rem',
        fontWeight: '600',
        color: '#2d3436'
    },
    input: {
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #dfe6e9',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border-color 0.2s',
        '&:focus': {
            borderColor: '#3498db'
        }
    },
    button: {
        marginTop: '10px',
        padding: '14px',
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
    },
    footer: {
        marginTop: '25px',
        borderTop: '1px solid #eee',
        paddingTop: '20px'
    },
    footerText: {
        fontSize: '0.9rem',
        color: '#636e72'
    },
    toggleLink: {
        color: '#3498db',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginLeft: '5px'
    }
};

export default Auth;