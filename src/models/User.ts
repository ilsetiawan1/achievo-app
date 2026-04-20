// src\models\User.ts

import { IMongoloquentSchema, IMongoloquentTimestamps, Model } from 'mongoloquent';

export interface IUser extends IMongoloquentSchema, IMongoloquentTimestamps {
  name: string;
  email: string;
  password?: string;
  total_exp: number;
  level: number;
}

export class User extends Model<IUser> {
  public static $schema: IUser;
  protected $collection: string = 'users';
  protected $useTimestamps: boolean = true;


}
