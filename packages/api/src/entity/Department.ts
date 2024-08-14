import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import Program from '@/entity/Program';
import Component from '@/entity/Component';

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

  @OneToMany(() => Component, (component) => component.department)
  components: Component[];
}

export default Department;
