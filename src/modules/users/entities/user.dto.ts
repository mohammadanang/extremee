export interface CreateUserDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  permissionLevel?: number;
}

export interface PutUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  permissionFlags: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PatchUserDto extends Partial<PutUserDto> {}
