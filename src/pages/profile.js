 import "../styles/profile.css";
import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function Profile() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        lastname: "",
        email: "",
        password: "",
        about: "",
        });
        
        const fetchUserData = async () => {
            try {
                const userId = window.localStorage.getItem("userID"); // Replace with the actual user ID
              const response = await axios.get(process.env.REACT_APP_END_POINT_RECIPES+`auth/user/${userId}`);
              const user = response.data;
              console.log("🚀 ~ file: profile.js:19 ~ fetchUserData ~ user:", user)
              setFormData({
                username: user.username,
                lastname: user.lastname,
                email: user.email,
                password: user.password,
                about: user.about,
                // Update other fields as needed
              });
            } catch (error) {
              console.error("Error fetching user:", error);
            }
          };
          useEffect(() => {
            fetchUserData();
          }, []);
        const handleInputChange = (e) => {
            const { name, value } = e.target;
            setFormData((prevData) => ({
              ...prevData,
              [name]: value,
            }));
          };
          const handleFormSubmit = async () => {
            try {
              // Make API request to update user
              const userId = window.localStorage.getItem("userID"); // Replace with the actual user ID
              const response = await axios.put(process.env.REACT_APP_END_POINT_RECIPES+`auth/update/${userId}`, formData);
              console.log("User updated:", response.data);
              // Handle success, e.g., show a success message
              navigate("/");
            } catch (error) {
              console.error("Error updating user:", error);
              // Handle error, e.g., show an error message
            }
          };
  return (
    <div>
      <div className="container rounded shadow bg-white mt-5 mb-5">
    <div className="row">
        
        <div className="col-md-5 justify-content-center border-right">
            <div className="p-3 py-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="text-right">Profile Settings</h4>
                </div>
                <div className="row mt-2">
                    <div className="col-md-6">
                        <label className="labels">userName</label>
                    <input type="text" className="form-control" name="username" value={formData.username}
                  onChange={handleInputChange} placeholder="userName" />
                    </div>
                    <div className="col-md-6"><label className="labels">lastname</label><input  name="lastname" type="text" className="form-control" value={formData.lastname}
                  onChange={handleInputChange} placeholder="surname"/></div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-12"><label className="labels">email</label><input name="email" type="text" className="form-control" placeholder="email" value={formData.email}
                  onChange={handleInputChange}/></div>
                    <div className="col-md-12"><label className="labels">password</label><input name="password" type="password" className="form-control" placeholder="password" value={formData.password}
                  onChange={handleInputChange}/></div>
                    <div className="col-md-12"><label className="labels">about</label><input name="about" type="text" className="form-control" placeholder="about" value={formData.about}
                  onChange={handleInputChange}/></div>
                     </div>
                 
                <div className="mt-5 text-center">
              <button
                className="btn btn-primary profile-button"
                type="button"
                onClick={handleFormSubmit}
              >
                update Profile
              </button>
            </div>            </div>
        </div>
        
    </div>
</div>
</div>
 
  )
}
