import { NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { BoardStatus } from './board-status.enum';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {
  async createBoard(
    createBoardDto: CreateBoardDto,
    user: User,
  ): Promise<Board> {
    const { title, description } = createBoardDto;

    const board: Board = await this.create({
      title,
      description,
      status: BoardStatus.PUBLIC,
      user: {
        id: user.id,
        username: user.username,
      },
    });

    await this.save(board);

    return board;
  }

  async getBoardById(id: number): Promise<Board> {
    const board: Board = await this.findOne(id);
    if (!board) {
      throw new NotFoundException(`Can't find a Board with id ${id}`);
    }

    return board;
  }
}
