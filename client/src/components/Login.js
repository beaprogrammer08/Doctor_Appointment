import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const containerStyle = {
    textAlign: "center",
    padding: "20px",
    backgroundImage:
        'url("https://img.freepik.com/free-vector/clean-medical-background_53876-97927.jpg")', // Update the path to your background image
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    // Other styles (omitted for brevity)
};

const headingStyle = {
    fontSize: "60px",
    color: "royalblue",
    margin: "10px 0",
};

const inputStyle = {
    width: "50%",
    padding: "10px",
    marginLeft: "25%",
    marginRight: "25%",
    marginTop: "10px",
    fontSize: "16px",
};

const buttonStyle = {
    backgroundColor: "red",
    color: "white",
    padding: "10px 20px",
    margin: "10px",
    border: "none",
    cursor: "pointer",
};

function Login() {
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials({
            ...credentials,
            [name]: value,
        });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        console.log(credentials);
        localStorage.removeItem("user");
        localStorage.clear("user");
        axios
            .post("http://localhost:8080/api/login", credentials)
            .then((response) => {
                console.log(response.data);
                if (response.data.login) {
                    if (response.data.verified) {
                        toast.success("Login successful");
                        const userDAta = JSON.stringify(response.data)
                        localStorage.setItem('user', userDAta)
                        if (response.data.role == 'doctor') {
                            navigate("/appointments");
                        }
                        else {
                            navigate("/home");
                        }
                    }
                    else {
                        toast.warn("Please Verify your Email first !!!");
                    }
                } else {
                    toast.error("Login failed Wrong Credentials");
                }
            })
            .catch((error) => {
                console.error("Login failed:", error);
                toast.error("Login failed");
                navigate("/");
            });
    };

    return (
        <form style={containerStyle} onSubmit={handleLogin}>
            <h2 style={headingStyle}>Login</h2>
            <input
                style={inputStyle}
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleInputChange}
                required
            />
            <input
                style={inputStyle}
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleInputChange}
                required
            />
            <button type="submit" style={buttonStyle}>
                Login
            </button>
            <button
                type="button"
                style={buttonStyle}
                onClick={() => navigate("/register")}
            >
                Register
            </button>
            <button type="button" style={buttonStyle} onClick={() => navigate("/")}>
                Home
            </button>
        </form>
    );
}

export default Login;
