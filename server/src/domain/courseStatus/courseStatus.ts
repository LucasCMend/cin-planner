export type Status = 'cursada' | 'cursando' | 'disponível' | 'bloqueada';

export type CourseStatusInput = {
  code: string;
  preRequisites: readonly string[];
  completed: ReadonlySet<string>;
  inProgress: ReadonlySet<string>;
};
// Essa função existe fundamentalmente para descobrir se uma disciplina pode (ou não) ser cursada
export default function courseStatus(input: CourseStatusInput): Status {
  const { code, preRequisites, completed, inProgress } = input;

  if (completed.has(code)) {
    return 'cursada';
  } else if (inProgress.has(code)) {
    return 'cursando';
  }
  for (const course of preRequisites) {
    if (!completed.has(course)) {
      return 'bloqueada';
    }
  }
  return 'disponível';
}
