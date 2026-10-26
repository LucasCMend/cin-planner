import { Router } from 'express';
import ValidateTermController from '../controllers/validateTermController.js';

const router = Router();

router.post('/validate', ValidateTermController.validateTerm);

export default router
