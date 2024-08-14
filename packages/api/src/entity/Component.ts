import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Department } from './Department';

export enum ComponentType {
  COURSE = 'COURSE',
  ACTIVITY = 'ACTIVITY',
}

@Entity()
export class Component {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  sigaaId: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({
    type: 'enum',
    enum: ComponentType,
  })
  type: ComponentType;

  @ManyToOne(() => Department)
  department: Department;
}
