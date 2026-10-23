export type TermInput = {
  termCourses: readonly string[];
  completed: ReadonlySet<string>;
  preRequisites: ReadonlyMap<string, string[]>;
  termWorkload: number;
};

type BlockReason = 'PR' | 'JC'; // Pré-requisitos | Já cursou

export type Output = {
  reason?: Map<string, BlockReason[]>; // Chave: Disciplina ; Valor: Motivos bloqueantes
  blocks?: Map<string, string[]>; // Chave: Disciplina que seria cursada ; Valor: Pré-requisitos faltantes
  completed?: string[]; // disciplinas já cursadas
  overWorkload?: boolean; // carga horária superior ao máximo permitido
};

// Valida se a escolha de disciplinas para esse período é válida. Se não for, mostra os motivos
export default function validateTerm(input: TermInput): Output {
  const maxWorkload = 480;
  const { termCourses, completed, preRequisites, termWorkload } = input;

  const reason = new Map<string, BlockReason[]>();
  const blocks = new Map<string, string[]>();
  const alreadyCompletedList: string[] = [];
  const isOverWorkload = termWorkload > maxWorkload;

  for (const course of termCourses) {
    const reasonsForCourse: BlockReason[] = [];

    if (completed.has(course)) {
      // Verifica se a disciplina selecionada já foi cursada
      reasonsForCourse.push('JC');
      alreadyCompletedList.push(course);
    }

    const requisites = preRequisites.get(course) ?? [];
    const missingRequisites = requisites.filter((requisite) => !completed.has(requisite));

    if (missingRequisites.length > 0) {
      // Verifica se tem pré-requisitos ainda não cursados
      reasonsForCourse.push('PR');
      blocks.set(course, missingRequisites);
    }

    if (reasonsForCourse.length > 0) {
      reason.set(course, reasonsForCourse);
    }
  }

  const output: Output = {
    reason,
    blocks,
    completed: alreadyCompletedList,
    overWorkload: isOverWorkload,
  };

  return output;
}
