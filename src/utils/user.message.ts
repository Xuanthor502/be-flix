export namespace ResponseMessages {
  export enum UserMessages {
    LIST = 'Retrieved user list with pagination.',
    FIND = 'User found by name.',
    REMOVE = 'User successfully deleted.',
    FIND_ID = 'User details fetched by ID.',
    UPDATE = 'User information updated successfully.',
    CREATE = 'New user created successfully.',
  }

  export enum PermissionMessages {
    LIST = 'Fetched permissions with pagination.',
    REMOVE = 'Permission deleted successfully.',
    FIND_ID = 'Permission details retrieved by ID.',
    UPDATE = 'Permission updated successfully.',
    CREATE = 'New permission created successfully.',
  }

  export enum RoleMessages {
    LIST = 'Fetched role list with pagination.',
    REMOVE = 'Role removed successfully.',
    FIND_ID = 'Role details retrieved by ID.',
    UPDATE = 'Role updated successfully.',
    CREATE = 'New role created successfully.',
  }

  export enum MovieMessages {
    LIST = 'Retrieved movie list with pagination.',
    FIND = 'Movie found by title.',
    REMOVE = 'Movie successfully deleted.',
    FIND_ID = 'Movie details fetched by ID.',
    UPDATE = 'Movie information updated successfully.',
    CREATE = 'New movie created successfully.',
  }
  export enum ListMessages {
    LIST = 'Retrieved list list with pagination.',
    FIND = 'List found by title.',
    REMOVE = 'List successfully deleted.',
    FIND_ID = 'List details fetched by ID.',
    UPDATE = 'List information updated successfully.',
    CREATE = 'New list created successfully.',
  }
  export enum EmailMessages {
    UPLOAD_EMAIL = 'Email uploaded successfully.',
  }

  export enum FileMessages {
    UPLOAD_SINGLE = 'Single file uploaded successfully.',
  }

  export enum AuthMessages {
    LOGIN = 'User logged in successfully.',
    STATUS = 'Retrieved user information.',
    REFRESH_TOKEN = 'User details fetched using refresh token.',
    REGISTER_USER = 'New user registered successfully.',
    LOGOUT = 'User logged out successfully.',
  }
}
