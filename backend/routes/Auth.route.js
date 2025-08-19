import express from 'express'
import { signup, login, healthCheck } from '../Controllers/authController.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.get('/health-check', healthCheck)

export default router
