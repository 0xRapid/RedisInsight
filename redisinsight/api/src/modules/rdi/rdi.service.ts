import { Injectable } from '@nestjs/common';
import { Rdi } from 'src/modules/rdi/models';
import { CreateRdiDto, UpdateRdiDto } from 'src/modules/rdi/dto';
import { RdiRepository } from 'src/modules/rdi/repository/rdi.repository';

@Injectable()
export class RdiService {
  constructor(
    private readonly repository: RdiRepository,
  ) {}

  async list(): Promise<Rdi[]> {
    return [];
  }

  async get(id: string): Promise<Rdi> {
    const rdi = await this.repository.get(id);

    if (!rdi) {
      throw new Error('TBD not found');
    }

    return rdi;
  }

  async update(id: string, dto: UpdateRdiDto): Promise<Rdi> {
    return null;
  }

  async create(dto: CreateRdiDto): Promise<Rdi> {
    return null;
  }

  async delete(id: string): Promise<void> {

  }
}
