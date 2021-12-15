import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { BoardStatus } from './board-status.enum';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {
  async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
    const { title, description } = createBoardDto;

    const board = await this.create({
      title,
      description,
      status: BoardStatus.PUBLIC,
    });

    await this.save(board);

    return board;
  }

  async getBoardById(id: number): Promise<Board> {
    const board = await this.findOne(id);
    if (!board) {
      throw new NotFoundException(`Can't find a Board with id ${id}`);
    }

    return board;
  }
}
