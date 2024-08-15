import { Entity, Column, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
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

  @Column({ type: 'varchar', nullable: true })
  prerequisites: string;

  @Column({ type: 'varchar', nullable: true })
  corequisites: string;

  @Column({ type: 'varchar', nullable: true })
  equivalences: string;

  @OneToMany(
    () => CurriculumComponent,
    (curriculumComponent) => curriculumComponent.curriculum,
  )
  curriculumComponent: CurriculumComponent;

  @ManyToOne(() => Department, (department) => department.programs)
  department: Department;
}

export default Component;
