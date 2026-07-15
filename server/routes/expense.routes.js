import { Router } from 'express';
import { expenseController } from '../controllers/expense.controller.js';
import { validateExpense } from '../middleware/validation.js';

const router = Router();

router.post('/user/:userId', validateExpense, expenseController.create);
router.get('/user/:userId', expenseController.list);
router.get('/user/:userId/summary', expenseController.summary);
router.delete('/:id', expenseController.remove);

export default router;
