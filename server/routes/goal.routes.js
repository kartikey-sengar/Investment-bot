import { Router } from 'express';
import { goalController } from '../controllers/goal.controller.js';
import { validateGoal } from '../middleware/validation.js';

const router = Router();

router.post('/user/:userId', validateGoal, goalController.create);
router.get('/user/:userId', goalController.list);
router.put('/:id', goalController.update);
router.delete('/:id', goalController.remove);

export default router;
