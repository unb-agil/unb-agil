import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';
import Curriculum from '@/entity/Curriculum';
import Component from '@/entity/Component';

export enum CurriculumComponentType {
  MANDATORY = 'MANDATORY',
  ELECTIVE = 'ELECTIVE',
}

@Entity()
@Unique(['curriculum', 'component'])
class CurriculumComponent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: CurriculumComponentType })
  type: CurriculumComponentType;

  @Column({ type: 'int', nullable: true })
  percentagePrequisite: number;

  @ManyToOne(() => Curriculum, (curriculum) => curriculum.curriculumComponent)
  curriculum: Curriculum;

  @ManyToOne(() => Component, (component) => component.curriculumComponent)
  component: Component;

  @Column({ nullable: true })
  componentSigaaId: Component['sigaaId'];
}

export default CurriculumComponent;
