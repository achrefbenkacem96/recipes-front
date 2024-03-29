import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import "../styles/login.css";

export const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // State for error message

    const [_, setCookies] = useCookies(["access_token"]);
    const navigate = useNavigate();

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(process.env.REACT_APP_END_POINT_RECIPES+"auth/login", {
                email,
                password
            });

            setCookies("access_token", response.data.token);
            window.localStorage.setItem("userID", response.data.userID);
            window.localStorage.setItem("email", email);
             navigate("/");
        } catch (error) {
            console.error(error);
            setError("Login failed. Please check your email and password."); // Set error message
        }
    };

    return (
        <div className="login container row col-12">
            <div className="form-container col-md-6 mt-5">
                <h1 className="title">Welcome back!</h1>
                <p className="subtitle">Please enter your details</p>
                <form onSubmit={onSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">email</label>
                        <input
                            type="text"
                            className="form-input"
                            id="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            id="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="login-btn">Log In</button>
                    {error && <p className="error-message">{error}</p>} {/* Display error message */}
                </form>
                <p className="register-text">Don't have an account?<Link className="register-link" to="/register">Sign Up</Link></p>
            </div>
            <div className="col-md-6">
                <img src={require("../assets/undraw_cooking_p7m1.svg").default} alt="login" />
            </div>
        </div>
    );
};
