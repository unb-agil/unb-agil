import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
// import { Program } from './Program';

@Entity()
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  sigaaId: number;

  @Column()
  acronym: string;

  @Column()
  title: string;

  //   @OneToMany(() => Program, (program) => program.department)
  //   programs: Program[];
}
