import React, { useState } from "react";
import axios from "axios";

const SettingSecurity = () => {

    const [formData, setFormData] = useState({
        current_password: "",
        new_password: "",
        confirm_password: ""
    });

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        setMessage("");
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        const {
            current_password,
            new_password,
            confirm_password
        } = formData;

        if (!current_password || !new_password || !confirm_password) {
            setError("All password fields are required");
            return;
        }

        if (new_password.length < 6) {
            setError("New password must be at least 6 characters");
            return;
        }

        if (new_password !== confirm_password) {
            setError("New password and confirm password do not match");
            return;
        }

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            const response = await axios.put(
                "http://localhost:5000/api/users/password",
                {
                    current_password,
                    new_password
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {

                setMessage(
                    response.data.message ||
                    "Password changed successfully"
                );

                setFormData({
                    current_password: "",
                    new_password: "",
                    confirm_password: ""
                });
            }

        } catch (err) {

            console.error(
                "Change Password Error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to change password"
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="settings-security">

            <div className="settings-header">
                <h2>Change Password</h2>

                <p>
                    Update your account password securely.
                </p>
            </div>

            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>

                {/* Current Password */}

                <div className="form-group">

                    <label>
                        Current Password
                    </label>

                    <div className="password-input">

                        <input
                            type={
                                showCurrent
                                    ? "text"
                                    : "password"
                            }
                            name="current_password"
                            value={
                                formData.current_password
                            }
                            onChange={handleChange}
                            placeholder="Enter current password"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowCurrent(!showCurrent)
                            }
                        >
                            {showCurrent ? "Hide" : "Show"}
                        </button>

                    </div>

                </div>


                {/* New Password */}

                <div className="form-group">

                    <label>
                        New Password
                    </label>

                    <div className="password-input">

                        <input
                            type={
                                showNew
                                    ? "text"
                                    : "password"
                            }
                            name="new_password"
                            value={
                                formData.new_password
                            }
                            onChange={handleChange}
                            placeholder="Enter new password"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowNew(!showNew)
                            }
                        >
                            {showNew ? "Hide" : "Show"}
                        </button>

                    </div>

                    <small>
                        Password must be at least 6 characters.
                    </small>

                </div>


                {/* Confirm Password */}

                <div className="form-group">

                    <label>
                        Confirm New Password
                    </label>

                    <div className="password-input">

                        <input
                            type={
                                showConfirm
                                    ? "text"
                                    : "password"
                            }
                            name="confirm_password"
                            value={
                                formData.confirm_password
                            }
                            onChange={handleChange}
                            placeholder="Confirm new password"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirm(!showConfirm)
                            }
                        >
                            {showConfirm ? "Hide" : "Show"}
                        </button>

                    </div>

                </div>


                {/* Submit */}

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Updating..."
                        : "Change Password"}
                </button>

            </form>

        </div>
    );
};

export default SettingSecurity;