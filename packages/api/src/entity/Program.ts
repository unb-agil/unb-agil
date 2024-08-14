import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Department } from './Department';

export enum Degree {
  BACHELOR = 'BACHELOR',
  LICENTIATE = 'LICENTIATE',
}

export enum Shift {
    DAY = 'DAY',
    NIGHT = 'NIGHT',
  }

@Entity()
export class Program {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  sigaaId: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({
    type: 'enum',
    enum: Degree,
  })
  degree: Degree;

  @Column({
    type: 'enum',
    enum: Shift,
  })
  shift: Shift;

  @ManyToOne(() => Department)
  department: Department;
}
