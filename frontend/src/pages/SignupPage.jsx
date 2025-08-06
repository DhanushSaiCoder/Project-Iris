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
            alert('Sign Up Completed');
            const userId = res.data.user?._id || res.data._id;
            localStorage.setItem('userId', userId);
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || 'Signup failed');
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