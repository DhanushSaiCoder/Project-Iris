import express from 'express';
import { getUsers, updateUserRole, getUsersByIds } from '../Controllers/userController.js';

const router = express.Router();

router.get('/', getUsers);
router.post('/by-ids', getUsersByIds);
router.put('/:id/role', updateUserRole);

export default router;