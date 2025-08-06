import { useState } from 'react'
import axios from 'axios'

export default function Signup() {
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '' })

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            const res = await axios.post('http://localhost:5000/api/auth/signup', formData)
            alert(res.data.message)
        } catch (err) {
            alert(err.response?.data?.message || 'Signup failed')
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Signup</h2>
            <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <button type="submit">Sign Up</button>
        </form>
    )
}
