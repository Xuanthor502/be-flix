import { Injectable } from '@nestjs/common';
import { IListServices } from '../interfaces/lists.interfaces';
import { List } from 'src/utils/schemas';
import {
  CreateResponse,
  FindListParams,
  ICurrentUser,
  Paginate,
  RemoveResponse,
  SearchOptions,
  SearchParams,
  UpdateResponse,
} from 'src/utils/types';
import { InjectModel } from '@nestjs/mongoose';
import { ListDocument } from 'src/utils/schemas/entities/list.entity';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { ListNotFoundException } from '../exceptions/list-not-found.excetions';
import { ListAlreadyExistsException } from '../exceptions/list-already-exists.excetions';
import aqp from 'api-query-params';
import { validateObjectId } from 'src/utils/helpers';
import { UpdateListDto } from '../dtos/update-list.dto';
import { CreateListDto } from '../dtos/create-list.dto';

@Injectable()
export class ListsService implements IListServices {
  constructor(
    @InjectModel(List.name) private listModel: SoftDeleteModel<ListDocument>,
  ) {}
  async findOneList(params: FindListParams): Promise<List> {
    const list = await this.listModel.findOne(params).exec();
    if (!list) {
      throw new ListNotFoundException();
    }
    return list;
  }
  async checkTitleListExits(title: string) {
    const isExist = await this.findOneList({ title: title });
    if (isExist) {
      throw new ListAlreadyExistsException();
    }
  }
  async createList(
    createListData: CreateListDto,
    currentUser: ICurrentUser,
  ): Promise<CreateResponse> {
    const { title } = createListData;
    await this.checkTitleListExits(title);
    const newList = await this.listModel.create({
      ...createListData,
      createdBy: {
        _id: currentUser._id,
        email: currentUser.email,
      },
    });
    return {
      _id: newList._id as unknown as string,
      createdAt: newList.createdAt as unknown as string,
    };
  }
  async searchLists(
    params?: SearchParams,
    options?: SearchOptions,
  ): Promise<Paginate<List[]>> {
    const { filter, sort } = aqp(options?.query || '');
    delete filter.current;
    delete filter.pageSize;
    const skip = params?.skip ?? 1;
    const limit = params?.limit ?? 10;
    const offset = (skip - 1) * limit;
    const totalItems = (await this.listModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / limit);
    const result = await this.listModel
      .find(filter)
      .skip(offset)
      .limit(limit)
      .sort(sort as any)
      .lean()
      .exec();
    return {
      meta: {
        current: skip,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }
  async updateList(
    id: string,
    updateListData: UpdateListDto,
    currentUser: ICurrentUser,
  ): Promise<UpdateResponse> {
    validateObjectId(id);
    await this.findOneList({ _id: id });
    const updatedList = await this.listModel.findByIdAndUpdate(
      id,
      {
        ...updateListData,
        updatedBy: {
          _id: currentUser._id,
          email: currentUser.email,
        },
      },
      { new: true },
    );
    const result = await this.findOneList({ _id: id });
    return {
      _id: result._id as unknown as string,
      updatedAt: result.updatedAt as unknown as string,
    };
  }
  async removeList(
    id: string,
    currentUser: ICurrentUser,
  ): Promise<RemoveResponse> {
    validateObjectId(id);
    await this.findOneList({ _id: id });
    const updateResult = await this.listModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: currentUser._id,
          email: currentUser.email,
        },
      },
    );
    if (updateResult.modifiedCount === 0) {
      throw new ListNotFoundException();
    }
    await this.listModel.softDelete({ _id: id });
    const result = await this.findOneList({ _id: id });
    return {
      _id: result?._id as unknown as string,
      deletedAt: result?.deletedAt as unknown as string,
    };
  }
}
