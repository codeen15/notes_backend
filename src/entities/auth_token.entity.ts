import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";
import { MaxLength, MinLength } from "class-validator";



@Entity()
export class AuthToken {


    @PrimaryColumn({
        unique: true
    })
    hashed: string;

    @Column({
        unique: true
    })
    @MinLength(10)
    @MaxLength(10)
    token_key: string;

    @ManyToOne(() => User, (user: User) => user.tokens)
    user: User;
}