import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  sigaaId: number;

  @Column({ type: 'varchar' })
  acronym: string;

  @Column({ type: 'varchar' })
  title: string;
}
