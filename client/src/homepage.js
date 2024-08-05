import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const [documents, setDocuments] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsLoggedIn(false); // Show login dialog if not logged in
        } else {
            fetchDocuments(token);
        }
    }, []);

    const fetchDocuments = async (token, navigate) => {
        try {
            const response = await axios.get('http://localhost:3001/api/user/documents/get', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
            setDocuments(response.data.documents);
        } catch (error) {
            console.error('Error fetching documents:', error);
            navigate('/login');
        }
    };


    const handleCreateDocument = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3001/api/user/documents/create', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const docID = response.data.newDocument._id;
            navigate(`/${docID}`);
        } catch (error) {
            console.error('Error fetching documents:', error);
            navigate('/login');
        }
    };

    const handleOpenDocument = (docID) => {
        navigate(`/${docID}`);
    };

    function handleLogout() {
        localStorage.removeItem('token');
        navigate('/');
        window.location.reload();
    }
    function handleLogin() {
        localStorage.removeItem('token');
        navigate('/login');
    }

    const handleGoToRoot = () => {
        navigate('/');
        window.location.reload();
    }

    const tileStyle = {
        display: 'inline-block', // Display buttons in a line
        margin: '10px', // Add some space around each button
        backgroundColor: '#4CAF50', // Background color
        color: 'white', // Text color
        padding: '20px', // Padding inside the buttons
        borderRadius: '10px', // Rounded corners
        width: '150px', // Fixed width
        height: '100px', // Fixed height
        textAlign: 'center', // Center text inside the button
        verticalAlign: 'middle', // Align text vertically
        lineHeight: '60px', // Line height to help vertically center the text
        cursor: 'pointer', // Change cursor on hover
        textDecoration: 'none', // Remove underline from links if any
        border: 'none', // Remove border
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#808080' }}>
                <h1 style={{ fontFamily: '"Roboto", sans-serif', fontSize: '24px', cursor: 'pointer' }} onClick={handleGoToRoot}>HolaDocs</h1>
                {isLoggedIn && <button onClick={handleLogout} style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>Logout</button>}
                {!isLoggedIn && <button onClick={handleLogin} style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>Login</button>}

            </div>
            {!isLoggedIn ? (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <h2>You are not logged in</h2>
                </div>
            ) : (
                <div>
                    <button onClick={() => handleCreateDocument()} style={tileStyle}>New Document</button>
                    <h2>Your Documents:</h2>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {documents.map((document) => (
                            <li key={document._id} style={{ display: 'inline-block' }}>
                                <button onClick={() => handleOpenDocument(document._id)} style={tileStyle}>{document.title}</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};

export default HomePage;
