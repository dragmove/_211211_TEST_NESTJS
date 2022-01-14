import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { getConnection } from 'typeorm';
import { BoardStatus } from './board-status.enum';
import { Board } from './board.entity';
import { BoardRepository } from './board.repository';
import { CreateBoardDto } from './dto/create-board.dto';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(BoardRepository) private boardRepository: BoardRepository,
  ) {}

  async getAllBoards(): Promise<Board[]> {
    return await this.boardRepository.find({
      order: {
        id: 'DESC',
      },
    });
  }

  async search(userId: number): Promise<Board[]> {
    const result = await this.boardRepository
      .createQueryBuilder('board')
      .where('board.userId = :userId', {
        userId: userId,
      })
      .getMany();

    return result;
  }

  async createBoard(
    createBoardDto: CreateBoardDto,
    user: User,
  ): Promise<Board> {
    return await this.boardRepository.createBoard(createBoardDto, user);
  }

  async getBoardById(id: number): Promise<Board> {
    return await this.boardRepository.getBoardById(id);
  }

  async deleteBoard(id: number): Promise<void> {
    const result = await this.boardRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Can't find Board with id ${id}`);
    }
  }

  async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
    const board: Board = await this.getBoardById(id);

    board.status = status;
    await this.boardRepository.save(board);

    return board;
  }

  // private boards: Board[] = [];
  // getAllBoards(): Board[] {
  //   return this.boards;
  // }
  // createBoard(createBoardDto: CreateBoardDto): Board {
  //   const { title, description } = createBoardDto;
  //   const board: Board = {
  //     id: uuidv1(new Date()),
  //     title,
  //     description,
  //     status: BoardStatus.PUBLIC,
  //   };
  //   this.boards.push(board);
  //   return board;
  // }
  // getBoardById(id: string): Board {
  //   const board: Board = this.boards.find((board) => board.id === id);
  //   if (!board) {
  //     throw new NotFoundException();
  //   }
  //   return board;
  // }
  // deleteBoard(id: string): void {
  //   const boardFound: Board = this.getBoardById(id);
  //   this.boards = this.boards.filter((board) => board.id !== boardFound.id);
  //   // TODO: return result
  // }
  // updateBoardStatus(id: string, status: BoardStatus): Board {
  //   const board: Board = this.getBoardById(id);
  //   board.status = status;
  //   return board;
  // }
}
