import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("chat_messages")
export class ChatMessage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "room_id", type: "varchar", length: 100 })
  roomId!: string;

  @Column({ type: "varchar", length: 50 })
  sender!: string;

  @Column({ type: "text" })
  message!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}