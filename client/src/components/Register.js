import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [user, setUser] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        contact: "",
        role: "patient",
        dob: "",
        gender: "",
        address: "",
        specialization: "",
    });

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value,
        });
    };

    const handleRegister = (e) => {
        e.preventDefault();
        localStorage.removeItem("user");
        localStorage.clear("user");
        axios
            .post("http://localhost:8080/api/signup", user) // Update the server URL
            .then((response) => {
                console.log(response.data);
                if (response.data.signup) {
                    toast.success("User registered successfully");
                    toast.warn("Check your mailbox to verify your email.");
                    navigate("/login");
                } else {
                    toast.error("User Registration Failed");
                }
            })
            .catch((error) => {
                console.error("Registration failed:", error);
                toast.error("Registration failed");
            });
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <form
                onSubmit={handleRegister}
                className="bg-white p-8 w-[80%] rounded shadow-md"
            >
                <h2 className="text-2xl mb-4">Register</h2>
                <div className="mb-4">
                    <input
                        type="text"
                        name="first_name"
                        placeholder="First Name"
                        className="w-full p-2 border rounded"
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="text"
                        name="last_name"
                        placeholder="Last Name"
                        className="w-full p-2 border rounded"
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full p-2 border rounded"
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full p-2 border rounded"
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="tel"
                        name="contact"
                        placeholder="Contact"
                        className="w-full p-2 border rounded"
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label>Role:</label>
                    <div>
                        <input
                            type="radio"
                            name="role"
                            value="doctor"
                            checked={user.role === "doctor"}
                            onChange={handleInputChange}
                        />
                        <label className="ml-2">Doctor</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            name="role"
                            value="patient"
                            checked={user.role === "patient"}
                            onChange={handleInputChange}
                        />
                        <label className="ml-2">Patient</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            name="role"
                            value="medic"
                            checked={user.role === "medic"}
                            onChange={handleInputChange}
                        />
                        <label className="ml-2">Medic</label>
                    </div>
                </div>
                {user.role === "doctor" ? (
                    <div className="mb-4">
                        <input
                            type="text"
                            name="specialization"
                            placeholder="Specialization"
                            className="w-full p-2 border rounded"
                            onChange={handleInputChange}
                            // value={user.specialization}
                            required
                        />
                    </div>
                ) : (
                    <></>
                )}
                <div className="mb-4">
                    <input
                        type="date"
                        name="dob"
                        placeholder="DOB"
                        className="w-full p-2 border rounded"
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="text"
                        name="gender"
                        placeholder="Gender"
                        className="w-full p-2 border rounded"
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        className="w-full p-2 border rounded"
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded"
                >
                    Register
                </button>
                <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="w-full mt-4 bg-gray-500 text-white p-2 rounded"
                >
                    Login
                </button>
                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="w-full mt-4 bg-gray-500 text-white p-2 rounded"
                >
                    Home
                </button>
            </form>
        </div>
    );
};

export default Register;
