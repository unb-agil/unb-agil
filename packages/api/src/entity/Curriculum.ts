import { Entity, Column, ManyToOne, PrimaryColumn, OneToMany } from 'typeorm';
import Program from '@/entity/Program';
import CurriculumComponent from '@/entity/CurriculumComponent';

@Entity()
class Curriculum {
  @PrimaryColumn({ type: 'varchar' })
  sigaaId: string;

  @Column({ type: 'boolean', nullable: true })
  isActive: boolean;

  @Column({ type: 'int', nullable: true })
  startYear: number;

  @Column({ type: 'int', nullable: true })
  startPeriod: number;

  @Column({ type: 'int', nullable: true })
  minPeriods: number;

  @Column({ type: 'int', nullable: true })
  maxPeriods: number;

  @Column({ type: 'int', nullable: true })
  minPeriodWorkload: number;

  @Column({ type: 'int', nullable: true })
  maxPeriodWorkload: number;

  @Column({ type: 'int', nullable: true })
  minWorkload: number;

  @Column({ type: 'int', nullable: true })
  mandatoryComponentsWorkload: number;

  @Column({ type: 'int', nullable: true })
  minElectiveComponentsWorkload: number;

  @Column({ type: 'int', nullable: true })
  maxElectiveComponentsWorkload: number;

  @Column({ type: 'int', nullable: true })
  minComplementaryComponentsWorkload: number;

  @Column({ type: 'int', nullable: true })
  maxComplementaryComponentsWorkload: number;

  @OneToMany(
    () => CurriculumComponent,
    (curriculumComponent) => curriculumComponent.curriculum,
  )
  curriculumComponent: CurriculumComponent;

  @ManyToOne(() => Program, (program) => program.curricula)
  program: Program;
}

export default Curriculum;
