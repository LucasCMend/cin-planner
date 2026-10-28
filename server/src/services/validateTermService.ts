import { ValidateTermInput } from '../dto/validateTermDTO.js';
import validateTerm, { TermInput } from '../domain/validateTerm/validateTerm.js';
import UserRepository from '../repositories/userRepository.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import CourseRepository from '../repositories/courseRepository.js';
import CoursePrerequisiteRepository from '../repositories/coursePrerequisiteRepository.js';
import UserCourseRepository from '../repositories/userCourseRepository.js';

export class ValidateTermService {
  async validateTerm(data: ValidateTermInput) {
    const completed = new Set<string>();
    const preRequisites = new Map<string, string[]>();
    let termWorkload: number = 0;
    const { userId, courses } = data;

    const user = await UserRepository.get(userId);

    if (!user) {
      throw new NotFoundError('Usuário');
    }

    for (const courseCode of courses) {
      const course = await CourseRepository.getByCode(courseCode);

      if (!course) {
        throw new NotFoundError('Disciplina');
      }

      const requisiteCodes = await CoursePrerequisiteRepository.getRequiredCodesByCourse(course.id);

      preRequisites.set(course.code, requisiteCodes);

      termWorkload = termWorkload + course.workloadHours;
    }

    for (const userCourse of await UserCourseRepository.getCodesByUser(userId)) {
      if (userCourse.status === 'CURSADA') {
        completed.add(userCourse.code);
      }
    }

    const input: TermInput = {
      completed,
      preRequisites,
      termCourses: courses,
      termWorkload,
    };

    const output = validateTerm(input);

    const reasonMap = output.reason ?? new Map();
    const reason = Object.fromEntries(reasonMap);

    const blocksMap = output.blocks ?? new Map();
    const blocks = Object.fromEntries(blocksMap);

    return {
    overWorkload: output.overWorkload,
    completed: output.completed,
    reason,
    blocks
};
  }
}

export default new ValidateTermService();
