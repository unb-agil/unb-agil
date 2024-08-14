import { Entity, Column, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import Department from '@/entity/Department';
import CurriculumComponent from '@/entity/CurriculumComponent';

export enum ComponentType {
  COURSE = 'COURSE',
  ACTIVITY = 'ACTIVITY',
}

@Entity()
class Component {
  @PrimaryColumn({ type: 'varchar' })
  sigaaId: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'enum', enum: ComponentType })
  type: ComponentType;

  @OneToMany(
    () => CurriculumComponent,
    (curriculumComponent) => curriculumComponent.curriculum,
  )
  curriculumComponent: CurriculumComponent;

  @ManyToOne(() => Department, (department) => department.programs)
  department: Department;
}

export default Component;
