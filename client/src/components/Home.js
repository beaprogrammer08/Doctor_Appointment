import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const containerStyle = {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#f2f2f2', // Light gray background color
    minHeight: '100vh', // Ensure the page fills the viewport height
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: 'url("https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWVkaWNhbCUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
};

const headingStyle = {
    fontSize: '60px', // Larger font size
    color: 'blue',
};

const buttonStyle = {
    backgroundColor: 'red',
    color: 'white',
    padding: '15px 30px', // Larger button size
    margin: '10px',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px', // Add a slight border radius
};

function Home() {
    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            navigate('/home')
        }
    }, [])
    const navigate = useNavigate();

    const handleRegister = () => {
        navigate('/register'); // Navigate to the Register page
    };

    const handleLogin = () => {
        navigate('/login'); // Navigate to the Login page
    };

    return (
        <div style={containerStyle}>
            <h2 style={headingStyle}>Welcome to the Hospital Portal</h2>
            <button style={buttonStyle} onClick={handleRegister}>
                Register
            </button>
            <button style={buttonStyle} onClick={handleLogin}>
                Login
            </button>
        </div>
    );
}

export default Home;
