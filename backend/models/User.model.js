import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    fullName: String,
    email: { type: String, unique: true },
    password: String,
    role: {
        type: String,
        enum: ['admin', 'user', 'developer'],
        default: 'user'
    }
})

export default mongoose.model('User', userSchema)
