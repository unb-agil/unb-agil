export interface ComponentScraperOptions {
  componentIds: string[];
}

export enum ComponentType {
  COURSE = 'DISCIPLINA',
  ACTIVITY = 'ATIVIDADE',
  BLOCK = 'BLOCO',
  MODULE = 'MÓDULO',
}

export interface ComponentDetails {
  title: string;
  type: string;
  department: string;
}

export interface Component {
  id: string;
  title: string;
  type: ComponentType;
  departmentId: number;
}
