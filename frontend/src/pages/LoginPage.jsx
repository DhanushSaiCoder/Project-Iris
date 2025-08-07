import { useState, useContext } from 'react'
import styles from './LoginPage.module.css'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' })
    const navigate = useNavigate()
    const { login } = useContext(AuthContext)

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async e => {
        e.preventDefault()

        const { email, password } = formData

        if (!email || !password) {
            alert('Please enter all details correctly')
            return
        }

        try {
            await login(email, password)
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || 'Login failed')
        }
    }



    return (
        <div className={styles.logincontainer}>
            <form onSubmit={handleSubmit} className={styles.loginform}>
                <h2 className={styles.logintitle}>Login</h2>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    required
                    className={styles.logininput}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    required
                    className={styles.logininput}
                />
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
