import { CourseStatusInput } from '../dto/courseStatusDTO.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import coursePrerequisiteRepository from '../repositories/coursePrerequisiteRepository.js';
import courseRepository from '../repositories/courseRepository.js';
import userCourseRepository from '../repositories/userCourseRepository.js';
import userRepository from '../repositories/userRepository.js';
import courseStatus from '../domain/courseStatus/courseStatus.js';

export class CourseStatusService {
  async courseStatus(data: CourseStatusInput) {
    const { userId, code } = data;

    const user = await userRepository.get(userId);

    if (!user) {
      throw new NotFoundError('Usuário');
    }

    const course = await courseRepository.getByCode(code);

    if (!course) {
      throw new NotFoundError('Disciplina');
    }

    const preRequisites = await coursePrerequisiteRepository.getRequiredCodesByCourse(course.id);

    const userCourses = await userCourseRepository.getCodesByUser(userId);
    const completed = new Set<string>();
    const inProgress = new Set<string>();

    for (const userCourse of userCourses) {
      if (userCourse.status === 'CURSADA') {
        completed.add(userCourse.code);
      } else if (userCourse.status === 'CURSANDO') {
        inProgress.add(userCourse.code);
      }
    }

    const status = courseStatus({ code, preRequisites, completed, inProgress });

    return { code, status };
  }
}

export default new CourseStatusService();
