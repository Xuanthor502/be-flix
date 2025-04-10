import mongoose from 'mongoose';

export type CreateUserDetails = {
  password: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  address: string;
  role: mongoose.Schema.Types.ObjectId;
  company: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
  };
};

export type UploadImageParams = {
  file: Express.Multer.File;
};

export type FindUserParams = Partial<{
  _id: string;
  email: string;
  name: string;
  refreshToken: string;
}>;
export type FindMovieParams = Partial<{
  _id: string;
  title: string;
  desc: string;
  img: string;
  imgTitle: string;
  imgSm: string;
  trailer: string;
  video: string;
  year: string;
  limit: string;
  genrce: string;
  isSeries: string;
}>;

export type FindPermissionParams = Partial<{
  _id: string;
  name: string;
  apiPath: string;
  method: string;
  module: string;
}>;

export type FindRoleParams = Partial<{
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  permissions: string;
}>;

export type FindSubscriberParams = Partial<{
  _id: string;
  email: string;
  name: string;
  skills: string[];
}>;

export type ICurrentUser = {
  _id: string;
  name: string;
  email: string;
  role: {
    _id: string;
    name: string;
  };
  permissions?: {
    _id: string;
    name: string;
    apiPath: string;
    module: string;
  }[];
};

export type FindUserOptions = Partial<{
  selectAll: boolean;
}>;

export type CreateResponse = {
  _id: string;
  createdAt: string;
};

export type UpdateResponse = {
  _id: string;
  updatedAt: string;
};

export type RemoveResponse = {
  _id: string;
  deletedAt: string;
};

export type SearchParams = Partial<{
  skip?: number;
  limit?: number;
}>;

export type SearchOptions = Partial<{
  query: string;
}>;

export type Paginate<T> = {
  meta: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  };
  result?: T;
};
