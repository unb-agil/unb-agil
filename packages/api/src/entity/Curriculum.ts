import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Program } from './Program';

@Entity()
export class Curriculum {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  sigaaId: number;

  @Column({ type: 'boolean' })
  active: boolean;

  @Column({ type: 'int' })
  start_year: number;

  @Column({ type: 'int' })
  start_period: number;

  @Column({ type: 'int' })
  min_periods: number;

  @Column({ type: 'int' })
  max_periods: number;

  @Column({ type: 'int' })
  min_period_workload: number;

  @Column({ type: 'int' })
  max_period_workload: number;

  @Column({ type: 'int' })
  min_workload: number;

  @Column({ type: 'int' })
  mandatory_components_workload: number;

  @Column({ type: 'int' })
  min_elective_components_workload: number;

  @Column({ type: 'int' })
  max_elective_components_workload: number;

  @Column({ type: 'int' })
  min_complementary_components_workload: number;

  @Column({ type: 'int' })
  max_complementary_components_workload: number;

  @ManyToOne(() => Program)
  program: Program;
}
