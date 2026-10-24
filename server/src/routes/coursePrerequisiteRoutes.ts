import { Router } from 'express';
import CoursePrerequisiteController from '../controllers/coursePrerequisiteController.js';

const router = Router();

router.post('/', CoursePrerequisiteController.create);
router.get('/', CoursePrerequisiteController.getAll);
router.get('/course/:courseId', CoursePrerequisiteController.getByCourse);
router.get('/:courseId/:requiredCourseId', CoursePrerequisiteController.get);
router.delete('/:courseId/:requiredCourseId', CoursePrerequisiteController.delete);

export default router;
