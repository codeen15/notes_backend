import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";


@Entity()
export class Note {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    content: string;

    @Column()
    color: string;

    @Column()
    created_at: Date;

    @ManyToOne(() => User, (user: User) => user.notes)
    user: User;

}