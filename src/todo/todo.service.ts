import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class TodoService {
  constructor(private readonly databaseService: DatabaseService) {
  }
  create(createTodoDto: Prisma.TodoCreateInput) {
    return this.databaseService.todo.create({
      data: createTodoDto,
    })
  }

  findAll() {
    return this.databaseService.todo.findMany();
  }

  findOne(id: number) {
    return this.databaseService.todo.findUnique({
      where: { id },
    })
  }

  update(id: number, updateTodoDto: Prisma.TodoUpdateInput) {
    return this.databaseService.todo.update({
      where: { id },
      data: updateTodoDto,
    })
  }

  remove(id: number) {
    return this.databaseService.todo.delete({
      where: { id },
    })
  }
}
