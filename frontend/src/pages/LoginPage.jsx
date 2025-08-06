import { useState } from 'react'
import styles from './LoginPage.module.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' })
    const navigate = useNavigate()

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
            const res = await axios.post('http://localhost:5555/auth/login', formData)
            localStorage.setItem('token', res.data.token)
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
            </form>
        </div>

    )
}
