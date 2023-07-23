import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from 'src/entities/note.entity';
import { Repository } from 'typeorm';
import { CreateNoteDto } from './dto/create-note.dto';
import { User } from 'src/entities/user.entity';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {

    constructor(
        @InjectRepository(Note)
        private notesRepository: Repository<Note>,
    ) { }

    async create(u: User, data: CreateNoteDto) {
        const noteData = new Note()
        noteData.user = u;
        noteData.title = data.title;
        noteData.content = data.content;
        noteData.color = data.color;
        noteData.created_at = new Date();

        const { user, ...note } = await this.notesRepository.save(noteData);

        return note;
    }

    async getAll(u: User) {
        const notes = await this.notesRepository.find({ where: { user: u } });

        return notes;
    }

    async get(u: User, id: string) {
        if (isNaN(Number(id))) {
            throw new BadRequestException('ID must be number');
        }

        const note = await this.notesRepository.findOne({ where: { user: u, id: Number(id) } });

        if (!note) {
            throw new NotFoundException('Note not found');
        }

        return note;
    }

    async update(u: User, id: string, data: UpdateNoteDto) {
        if (isNaN(Number(id))) {
            throw new BadRequestException('ID must be number');
        }

        var note = await this.notesRepository.findOne({ where: { user: u, id: Number(id) } });

        if (!note) {
            throw new NotFoundException('Note not found');
        }

        note.title = data.title ?? note.title;
        note.content = data.content ?? note.content;
        note.color = data.color ?? note.color;

        note = await this.notesRepository.save(note);

        return note;
    }

    async delete(u: User, id: string) {
        if (isNaN(Number(id))) {
            throw new BadRequestException('ID must be number');
        }

        var res = await this.notesRepository.delete({ user: u, id: Number(id) });

        if (res.affected == 0) {
            throw new NotFoundException('Note not found');
        }

        return;
    }

}
