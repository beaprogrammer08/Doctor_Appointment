import React, { useEffect, useState } from 'react';

const EmailVerification = () => {
    const [verificationStatus, setVerificationStatus] = useState('');

    useEffect(() => {
        // Extract the token from the URL
        const token = new URLSearchParams(window.location.search).get('token');

        // Check if the token is present in the URL
        if (token) {
            // Create an object with the token to be sent in the request body
            const verificationData = { token };

            // Send a POST request to the server
            fetch('http://localhost:8080/api/verifyemail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(verificationData),
            })
                .then((response) => {
                    if (response.status === 200) {
                        setVerificationStatus('Email verified successfully!');
                    } else {
                        setVerificationStatus('Email verification failed or already verified. ');
                    }
                })
                .catch((error) => {
                    console.error(error);
                    setVerificationStatus('An error occurred during email verification.');
                });
        } else {
            setVerificationStatus('Token is missing in the URL.');
        }
    }, []);

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 shadow-md rounded-lg">
                <h1 className="text-2xl font-bold mb-4">Email Verification Status</h1>
                <p className="text-lg text-center">{verificationStatus}</p>
            </div>
        </div>
    );
};

export default EmailVerification;
