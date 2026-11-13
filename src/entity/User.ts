import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar" })
  lastName!: string;

  @Column({ type: "varchar" })
  firstName!: string;

  @Column({ type: "varchar", unique: true })
  email!: string;

  @Column({ type: "varchar" })
  password!: string; // 실제 서비스에서는 비밀번호를 해싱(bcrypt)해서 저장해야 합니다.

  @Column({ type: "varchar", nullable: true })
  phone!: string;

  @Column({ type: "varchar", nullable: true })
  zipCode!: string;

  @Column({ type: "varchar", nullable: true })
  address!: string;

  @Column({ type: "varchar", nullable: true })
  detailAddress!: string;

  @CreateDateColumn()
  createdAt!: Date;
}