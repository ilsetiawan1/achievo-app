// src\models\Task.ts

import { ObjectId } from 'mongodb'; 
import { IMongoloquentSchema, IMongoloquentTimestamps, IMongoloquentSoftDelete, Model } from 'mongoloquent';
import { User } from './User';

export interface ITask extends IMongoloquentSchema, IMongoloquentTimestamps, IMongoloquentSoftDelete {
  user_id: ObjectId;
  title: string;
  description: string;
  category: string;
  start_time: Date;
  end_time: Date;
  is_completed: boolean;
  exp_earned: number;
  completed_at?: string | null;
}

export class Task extends Model<ITask> {
  public static $schema: ITask;
  protected $collection: string = 'tasks';
  protected $useTimestamps: boolean = true;
  protected $useSoftDelete: boolean = true;

  public user() {
    return this.belongsTo(User, 'user_id', '_id');
  }
}
