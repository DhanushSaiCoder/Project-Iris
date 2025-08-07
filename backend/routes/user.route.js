import express from 'express';
import { getUsers, updateUserRole } from '../controllers/userController.js';

const router = express.Router();

router.get('/', getUsers);
router.put('/:id/role', updateUserRole);

export default router;