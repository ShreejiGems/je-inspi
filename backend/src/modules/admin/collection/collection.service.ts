import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { CollectionCoreService } from 'src/core/collection-core/collection-core.service';
import { collectionMessage } from 'src/shared/keys/user.key';
import { STATUS } from '@prisma/client';

@Injectable()
export class CollectionService {
  constructor(private collectionCoreService: CollectionCoreService) {}

  async create(createCollectionDto: CreateCollectionDto) {
    const { collectionName } = createCollectionDto;

    return await this.collectionCoreService.create({
      data: { name: collectionName },
    });
  }

  async findAll() {
    return await this.collectionCoreService.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findAllEnabled() {
    return await this.collectionCoreService.findMany({
      where: { isDeleted: false, status: STATUS.ENABLED },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: string) {
    const collectionExist = await this.collectionCoreService.findFirst({
      where: { isDeleted: false, id },
    });

    if (!collectionExist) {
      throw new BadRequestException(collectionMessage.COLLECTION_NOT_FOUND);
    }

    return collectionExist;
  }

  async update(id: string, updateCollectionDto: UpdateCollectionDto) {
    const { collectionName } = updateCollectionDto;

    const collectionExist = await this.collectionCoreService.findFirst({
      where: { isDeleted: false, id },
    });

    if (!collectionExist) {
      throw new BadRequestException(collectionMessage.COLLECTION_NOT_FOUND);
    }

    return await this.collectionCoreService.update({
      where: { id },
      data: { name: collectionName },
    });
  }

  async enable(id: string) {
    const collectionExist = await this.collectionCoreService.findFirst({
      where: { isDeleted: false, id },
    });

    if (!collectionExist) {
      throw new BadRequestException(collectionMessage.COLLECTION_NOT_FOUND);
    }

    return await this.collectionCoreService.update({
      where: { id },
      data: { status: STATUS.ENABLED },
    });
  }

  async disable(id: string) {
    const collectionExist = await this.collectionCoreService.findFirst({
      where: { isDeleted: false, id },
    });

    if (!collectionExist) {
      throw new BadRequestException(collectionMessage.COLLECTION_NOT_FOUND);
    }

    return await this.collectionCoreService.update({
      where: { id },
      data: { status: STATUS.DISABLED },
    });
  }

  async remove(id: string) {
    const collectionExist = await this.collectionCoreService.findFirst({
      where: { isDeleted: false, id },
    });

    if (!collectionExist) {
      throw new BadRequestException(collectionMessage.COLLECTION_NOT_FOUND);
    }

    return await this.collectionCoreService.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
