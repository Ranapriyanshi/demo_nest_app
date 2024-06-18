import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'projects' })
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  projectName: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
