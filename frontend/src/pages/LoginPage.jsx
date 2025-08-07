import { useState, useContext } from 'react'
import styles from './LoginPage.module.css'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'
import { Eye, EyeOff } from 'lucide-react'

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const { login } = useContext(AuthContext)
    const { showNotification } = useNotification()

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const handleSubmit = async e => {
        e.preventDefault()

        const { email, password } = formData

        if (!email || !password) {
            showNotification('Please enter all details correctly', 'warning')
            return
        }

        try {
            await login(email, password)
            showNotification('Login successful!', 'success')
            navigate('/');
        } catch (err) {
            showNotification(err.response?.data?.message || 'Login failed', 'error')
        }
    }



    return (
        <div className={styles.logincontainer}>
            <form onSubmit={handleSubmit} className={styles.loginform}>
                <h2 className={styles.logintitle}>Login</h2>
                <div className={styles.inputWrapper}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        required
                        className={styles.logininput}
                    />
                </div>
                <div className={styles.passwordInputContainer}>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                        className={styles.logininput}
                    />
                    <span
                        className={styles.passwordToggle}
                        onClick={togglePasswordVisibility}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </span>
                </div>
                <a href="/forgot" className={styles.forgotpasswordlink}>
                    Forgot Password?
                </a>
                <button type="submit" className={styles.loginbutton}>
                    Log In
                </button>
                <div className={styles.signuptext}>
                    Don't have an account? <a href="/signup" className={styles.signuplink}>Sign up</a>
                </div>
            </form>
        </div>
    )
}
