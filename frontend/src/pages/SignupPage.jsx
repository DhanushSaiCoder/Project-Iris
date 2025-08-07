import { useState } from 'react';
import styles from './SignupPage.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const navigate = useNavigate();

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const { fullName, email, password, confirmPassword } = formData;

        // Check all fields filled
        if (!fullName || !email || !password || !confirmPassword) {
            alert('Please fill in all fields.');
            return;
        }

        // Email format check (only allow .mail, .email, .yooha)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address ending with .mail, .email, or .yooha.');
            return;
        }

        // Password length
        if (password.length < 7) {
            alert('Password must be at least 7 characters long.');
            return;
        }

        // Password special character
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (!specialCharRegex.test(password)) {
            alert('Password must contain at least one special character.');
            return;
        }

        // Passwords match
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        // Submit signup
        try {
            const res = await axios.post('http://localhost:5555/auth/signup', {
                fullName,
                email,
                password
            });

            const userId = res.data.userId;
            if (!userId) {
                alert("Signup successful, but user ID missing.");
                return;
            }

            // ✅ Save userId in localStorage
            localStorage.setItem("userId", userId);

            // ✅ Check if trial sessions exist
            const trialSessions = JSON.parse(localStorage.getItem("trialSessions") || "[]");

            if (trialSessions.length > 0) {
                // Add userId to each trial session
                const updatedSessions = trialSessions.map((session) => ({
                    ...session,
                    userId
                }));

                try {
                    // Send each session to backend
                    for (const session of updatedSessions) {
                        await axios.post('http://localhost:5555/session', session);
                    }

                    console.log("Trial sessions uploaded successfully.");

                    // ✅ Clear trial data from localStorage
                    localStorage.removeItem("trialSessions");
                    localStorage.removeItem("trialCount");
                } catch (uploadErr) {
                    console.error("Failed to upload trial sessions:", uploadErr);
                }
            }

            alert("Sign Up Completed");
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || "Signup failed");
        }

    };

    return (
        <div className={styles.signupContainer}>
            <form className={styles.signupForm} onSubmit={handleSubmit}>
                <h2 className={styles.signupTitle}>Create Account</h2>
                <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className={styles.signupInput}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={styles.signupInput}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={styles.signupInput}
                />
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className={styles.signupInput}
                />
                <button type="submit" className={styles.signupButton}>Sign Up</button>
                <p className={styles.signupLoginText}>
                    Already have an account? <a href="/login" className={styles.signupLoginLink}>Login</a>
                </p>
            </form>
        </div>
    );
}