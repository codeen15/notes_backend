import { Column, Entity, OneToMany, PrimaryGeneratedColumn, } from "typeorm";
import { AuthToken } from "./auth_token.entity";
import { Note } from "./note.entity";



@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @OneToMany(() => Note, (note: Note) => note.user)
    notes: Note[];

    @OneToMany(() => AuthToken, (token: AuthToken) => token.user)
    tokens: AuthToken[];
}