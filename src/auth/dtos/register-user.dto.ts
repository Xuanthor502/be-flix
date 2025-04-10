import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email: string;

  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string;

  @IsNotEmpty({ message: 'Age cannot be empty' })
  age: number;

  @IsNotEmpty({ message: 'Gender cannot be empty' })
  gender: string;

  @IsNotEmpty({ message: 'Address cannot be empty' })
  address: string;
}

