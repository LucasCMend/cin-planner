import { Router } from 'express';
import ValidateTermController from '../controllers/validateTermController.js';
import courseStatusController from '../controllers/courseStatusController.js';

const router = Router();

router.post('/term', ValidateTermController.validateTerm);
router.post('/course', courseStatusController.courseStatus);

export default router;
