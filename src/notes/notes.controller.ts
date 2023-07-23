import { Body, Controller, Delete, Get, HttpCode, Logger, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateNoteDto } from './dto/update-note.dto';

@Controller('notes')
export class NotesController {

    constructor(private noteService: NotesService) { }

    @Post()
    @UseGuards(AuthGuard('token'))
    create(@Request() request: any, @Body() body: CreateNoteDto) {
        return this.noteService.create(request.user, body);
    }

    @Get()
    @UseGuards(AuthGuard('token'))
    getAll(@Request() request: any) {
        return this.noteService.getAll(request.user);
    }

    @Get(':id')
    @UseGuards(AuthGuard('token'))
    get(@Request() request: any, @Param('id') id: any) {
        return this.noteService.get(request.user, id);
    }

    @Put(':id')
    @UseGuards(AuthGuard('token'))
    update(@Request() request: any, @Param('id') id: any, @Body() body: UpdateNoteDto) {
        return this.noteService.update(request.user, id, body);
    }

    @Delete(':id')
    @HttpCode(204)
    @UseGuards(AuthGuard('token'))
    delete(@Request() request: any, @Param('id') id: any) {
        return this.noteService.delete(request.user, id);
    }
}
