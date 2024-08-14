import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import Curriculum from '@/entity/Curriculum';
import Component from '@/entity/Component';

export enum CurriculumComponentType {
  MANDATORY = 'MANDATORY',
  ELECTIVE = 'ELECTIVE',
}

@Entity()
class CurriculumComponent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: CurriculumComponentType })
  type: CurriculumComponentType;

  @Column({ type: 'int' })
  percentagePrequisite: number;

  @ManyToOne(() => Curriculum, (curriculum) => curriculum.curriculumComponent)
  curriculum: Curriculum;

  @ManyToOne(() => Component, (component) => component.curriculumComponent)
  component: Component;
}

export default CurriculumComponent;
