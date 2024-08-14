import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import Program from '@/entity/Program';

@Entity()
class Department {
  @PrimaryColumn({ type: 'int' })
  sigaaId: number;

  @Column({ type: 'varchar', nullable: true })
  acronym: string;

  @Column({ type: 'varchar', nullable: true })
  title: string;

  @OneToMany(() => Program, (program) => program.department)
  programs: Program[];
}

export default Department;
