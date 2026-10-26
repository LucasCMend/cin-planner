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

      const courseId = course.id;

      const coursePreRequisites = await CoursePrerequisiteRepository.getByCourse(courseId);

      const requisiteCodes: string[] = [];

      for (const courseOfRequisites of coursePreRequisites) {
        const requisite = await CourseRepository.get(courseOfRequisites.requiredCourseId);

        if (!requisite) {
          throw new NotFoundError('Pré-requisito');
        }

        requisiteCodes.push(requisite.code);
      }

      preRequisites.set(course.code, requisiteCodes);

      termWorkload = termWorkload + course.workloadHours;
    }

    const completedArray = (await UserCourseRepository.getByUser(userId)).filter(
      (course) => course.status === 'CURSADA',
    );

    for (const course of completedArray) {
      const courseMain = await CourseRepository.get(course.courseId);
      completed.add(courseMain.code);
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
