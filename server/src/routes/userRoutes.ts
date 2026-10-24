import { Router } from 'express';
import UserController from '../controllers/userController.js';

const router = Router();

router.post('/', UserController.create);
router.get('/', UserController.getAll);
router.get('/email/:email', UserController.getByEmail);
router.get('/:id', UserController.get);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.delete);

export default router;
