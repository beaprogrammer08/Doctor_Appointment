import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

const GetAllMedicine = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [token, settoken] = useState(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);

        // Display image preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        if (selectedFile) {
            reader.readAsDataURL(selectedFile);
        } else {
            setImagePreview(null);
        }
    };
    useEffect(() => {
        const data = localStorage.getItem('user')
        if (data) {

            const k = JSON.parse(data)
            settoken(k.id)
        }
        else {
            navigate('/')
        }
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', name);
        formData.append('phoneNumber', phoneNumber);
        formData.append('email', email);
        formData.append('userId', token);

        try {
            const response = await axios.post('http://localhost:8080/medic', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                toast.success('Success!!!')
                navigate('/patientMedicProfile');
            } else {
                console.error('Failed to submit data');
            }
        } catch (error) {
            console.error('Error occurred:', error);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-gray-100 rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold mb-6">Buy Medicines from Medic</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="fileInput" className="block mb-1">Upload Prescription</label>
                    <input
                        id="fileInput"
                        type='file'
                        accept="image/*"
                        onChange={handleFileChange}
                        className="border p-2 w-full rounded-md"
                    />
                    {imagePreview && (
                        <div className="mt-4">
                            <p className="font-semibold mb-2">Image Preview:</p>
                            <img src={imagePreview} alt="Preview" className="max-w-xs rounded-md shadow-md" />
                        </div>
                    )}
                </div>
                <div>
                    <label htmlFor="nameInput" className="block mb-1">Your Name</label>
                    <input
                        id="nameInput"
                        placeholder="Name..."
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border p-2 w-full rounded-md"
                    />
                </div>
                <div>
                    <label htmlFor="phoneInput" className="block mb-1">Your Phone Number</label>
                    <input
                        id="phoneInput"
                        placeholder="Phone Number ..."
                        type='text'
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="border p-2 w-full rounded-md"
                    />
                </div>
                <div>
                    <label htmlFor="emailInput" className="block mb-1">Your Email</label>
                    <input
                        id="emailInput"
                        placeholder="Email ..."
                        type='text'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border p-2 w-full rounded-md"
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                    Book Prescription
                </button>
            </form>
        </div>
    );
};

export default GetAllMedicine;
