import { LucidRow } from '@ioc:Adonis/Lucid/Orm';
import BaseService from './BaseService';
import User from 'App/Models/User';

export default class UserService extends BaseService<User> {
  constructor() {
    super(User);
  }

  public async findByExternalId(externalId: string, externalSource: string): Promise<LucidRow | null> {
    return await this.model
      .query()
      .where('external_id', externalId)
      .andWhere('external_source', externalSource)
      .andWhere('is_deleted', false)
      .first();
  }
}
