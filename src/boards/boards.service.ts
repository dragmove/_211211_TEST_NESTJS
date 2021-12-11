import { Injectable, NotFoundException } from '@nestjs/common';
import { Board, BoardStatus } from './board.model';
import { v1 as uuidv1 } from 'uuid';
import { CreateBoardDto } from './dto/create-board.dto';

@Injectable()
export class BoardsService {
  private boards: Board[] = [];

  getAllBoards(): Board[] {
    return this.boards;
  }

  createBoard(createBoardDto: CreateBoardDto): Board {
    const { title, description } = createBoardDto;

    const board: Board = {
      id: uuidv1(new Date()),
      title,
      description,
      status: BoardStatus.PUBLIC,
    };
    this.boards.push(board);

    return board;
  }

  getBoardById(id: string): Board {
    const board: Board = this.boards.find((board) => board.id === id);
    if (!board) {
      throw new NotFoundException();
    }

    return board;
  }

  deleteBoard(id: string): void {
    const boardFound: Board = this.getBoardById(id);
    this.boards = this.boards.filter((board) => board.id !== boardFound.id);
    // TODO: return result
  }

  updateBoardStatus(id: string, status: BoardStatus): Board {
    const board: Board = this.getBoardById(id);
    board.status = status;
    return board;
  }
}
