import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Department {
  @PrimaryColumn({ type: 'int' })
  sigaaId: number;

  @Column({ type: 'varchar', nullable: true })
  acronym: string;

  @Column({ type: 'varchar', nullable: true })
  title: string;
}
