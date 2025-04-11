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
import { CreateListDto } from '../dtos/create-list.dto';
import { UpdateListDto } from '../dtos/update-list.dto';

export interface IListServices {
  findOneList(params: FindListParams): Promise<List>;
  checkTitleListExits(title: string): Promise<any>;
  createList(
    createListData: CreateListDto,
    currentUser: ICurrentUser,
  ): Promise<CreateResponse>;
  searchLists(
    params?: SearchParams,
    options?: SearchOptions,
  ): Promise<Paginate<List[]>>;
  updateList(
    id: string,
    updateListData: UpdateListDto,
    currentUser: ICurrentUser,
  ): Promise<UpdateResponse>;
  removeList(id: string, currentUser: ICurrentUser): Promise<RemoveResponse>;
}
