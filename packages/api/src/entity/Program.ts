import { Entity, Column, ManyToOne, PrimaryColumn, OneToMany } from 'typeorm';
import Department from '@/entity/Department';
import Curriculum from '@/entity/Curriculum';

export enum Degree {
  BACHELOR = 'BACHELOR',
  LICENTIATE = 'LICENTIATE',
}

export enum Shift {
  DAY = 'DAY',
  NIGHT = 'NIGHT',
}

@Entity()
class Program {
  @PrimaryColumn({ type: 'int' })
  sigaaId: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'enum', enum: Degree })
  degree: Degree;

  @Column({ type: 'enum', enum: Shift })
  shift: Shift;

  @ManyToOne(() => Department, (department) => department.programs)
  department: Department;

  @OneToMany(() => Curriculum, (curriculum) => curriculum.program)
  curricula: Curriculum[];
}

export default Program;
