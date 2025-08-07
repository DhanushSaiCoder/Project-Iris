import { useState, useContext } from 'react';
import styles from './SignupPage.module.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Eye, EyeOff } from 'lucide-react';

export default function Signup() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();
    const { signup } = useContext(AuthContext);
    const { showNotification } = useNotification();

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const { fullName, email, password, confirmPassword } = formData;

        // Check all fields filled
        if (!fullName || !email || !password || !confirmPassword) {
            showNotification('Please fill in all fields.', 'warning');
            return;
        }

        // Email format check (only allow .mail, .email, .yooha)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address ending with .mail, .email, or .yooha.', 'warning');
            return;
        }

        // Password length
        if (password.length < 7) {
            showNotification('Password must be at least 7 characters long.', 'warning');
            return;
        }

        // Password special character
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (!specialCharRegex.test(password)) {
            showNotification('Password must contain at least one special character.', 'warning');
            return;
        }

        // Passwords match
        if (password !== confirmPassword) {
            showNotification('Passwords do not match.', 'warning');
            return;
        }

        // Submit signup
        try {
            await signup(fullName, email, password);
            showNotification('Sign Up Completed', 'success');
            navigate('/login'); // Navigate to login after successful signup
        } catch (err) {
            showNotification(err.response?.data?.message || 'Signup failed', 'error');
        }
    };

    return (
        <div className={styles.signupContainer}>
            <form className={styles.signupForm} onSubmit={handleSubmit}>
                <h2 className={styles.signupTitle}>Create Account</h2>
                <div className={styles.inputWrapper}>
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className={styles.signupInput}
                    />
                </div>
                <div className={styles.inputWrapper}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={styles.signupInput}
                    />
                </div>
                <div className={styles.passwordInputContainer}>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className={styles.signupInput}
                    />
                    <span
                        className={styles.passwordToggle}
                        onClick={togglePasswordVisibility}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </span>
                </div>
                <div className={styles.passwordInputContainer}>
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className={styles.signupInput}
                    />
                    <span
                        className={styles.passwordToggle}
                        onClick={toggleConfirmPasswordVisibility}
                    >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </span>
                </div>
                <button type="submit" className={styles.signupButton}>Sign Up</button>
                <p className={styles.signupLoginText}>
                    Already have an account? <a href="/login" className={styles.signupLoginLink}>Login</a>
                </p>
            </form>
        </div>
    );
}