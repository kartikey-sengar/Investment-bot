import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { validateUserProfile } from '../middleware/validation.js';

const router = Router();

router.get('/', userController.list);
router.post('/', validateUserProfile, userController.create);
router.get('/:id', userController.getProfile);
router.put('/:id', userController.update);
router.delete('/:id', userController.remove);

export default router;
