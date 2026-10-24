import { Router } from 'express';
import UserCourseController from '../controllers/userCourseController.js';

const router = Router();

router.post('/', UserCourseController.create);
router.get('/', UserCourseController.getAll);
router.get('/user/:userId', UserCourseController.getByUser);
router.get('/:userId/:courseId', UserCourseController.get);
router.put('/:userId/:courseId', UserCourseController.update);
router.delete('/:userId/:courseId', UserCourseController.delete);

export default router;
