import { Entity, Column, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { RequisitesExpression } from '@unb-agil/requisites-parser';
import Department from '@/entity/Department';
import CurriculumComponent from '@/entity/CurriculumComponent';

export enum ComponentType {
  COURSE = 'COURSE',
  ACTIVITY = 'ACTIVITY',
  BLOCK = 'BLOCK',
  MODULE = 'MODULE',
}

@Entity()
class Component {
  @PrimaryColumn({ type: 'varchar' })
  sigaaId: string;

  @Column({ type: 'varchar', nullable: true })
  title: string;

  @Column({ type: 'enum', enum: ComponentType, nullable: true })
  type: ComponentType;

  @Column({ type: 'simple-json', nullable: true })
  prerequisites: RequisitesExpression;

  @Column({ type: 'simple-json', nullable: true })
  corequisites: RequisitesExpression;

  @Column({ type: 'simple-json', nullable: true })
  equivalences: RequisitesExpression;

  @OneToMany(
    () => CurriculumComponent,
    (curriculumComponent) => curriculumComponent.curriculum,
  )
  curriculumComponent: CurriculumComponent;

  @ManyToOne(() => Department, (department) => department.programs)
  department: Department;

  @Column({ type: 'int', nullable: true })
  departmentSigaaId: number;
}

export default Component;
