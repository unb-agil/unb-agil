import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Curriculum } from './Curriculum';
import { Component } from './Component';

export enum CurriculumComponentType {
  MANDATORY = 'MANDATORY',
  ELECTIVE = 'ELECTIVE',
}

@Entity()
export class CurriculumComponent {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Curriculum)
  curriculum: Curriculum;

  @ManyToOne(() => Component)
  component: Component;

  @Column({
    type: 'enum',
    enum: CurriculumComponentType,
  })
  type: CurriculumComponentType;

  @Column({ type: 'int' })
  percentage_prequisite: number;
}
