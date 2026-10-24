import { Router } from 'express';
import MajorController from '../controllers/majorController.js';

const router = Router();

router.post('/', MajorController.create);
router.get('/', MajorController.getAll);
router.get('/code/:code', MajorController.getByCode);
router.get('/:id', MajorController.get);
router.put('/:id', MajorController.update);
router.delete('/:id', MajorController.delete);

export default router;
