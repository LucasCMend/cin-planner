import { Router } from 'express';
import MajorCourseController from '../controllers/majorCourseController.js';

const router = Router();

router.post('/', MajorCourseController.create);
router.get('/', MajorCourseController.getAll);
router.get('/major/:majorId', MajorCourseController.getByMajor);
router.get('/:majorId/:courseId', MajorCourseController.get);
router.put('/:majorId/:courseId', MajorCourseController.update);
router.delete('/:majorId/:courseId', MajorCourseController.delete);

export default router;
