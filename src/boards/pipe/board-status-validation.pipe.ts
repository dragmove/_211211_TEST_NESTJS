import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { BoardStatus } from '../board-status.enum';

@Injectable()
export class BoardStatusValidationPipe implements PipeTransform {
  readonly StatusOptions: string[] = [BoardStatus.PRIVATE, BoardStatus.PUBLIC];

  transform(value: BoardStatus, metadata: ArgumentMetadata): string {
    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`${value} is not in the status options`);
    }

    return value;
  }

  private isStatusValid(status: string): boolean {
    return this.StatusOptions.indexOf(status) >= 0;
  }
}
