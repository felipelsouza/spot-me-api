import Database from '@ioc:Adonis/Lucid/Database';
import { LucidRow } from '@ioc:Adonis/Lucid/Orm';
import BaseService from './BaseService';
import User from 'App/Models/User';

export default class UserService extends BaseService<User> {
  constructor() {
    super(User);
  }

  public async findHasUserByEmailAndExternalId(
    email: string,
    externalId: string,
    externalSource: string
  ): Promise<Boolean> {
    const { rows: hasUser } = await Database.rawQuery(
      `
        SELECT
          1
        FROM
          users
        WHERE
          email = :email
          AND is_deleted = false
        UNION ALL
        SELECT
          1
        FROM
          users
        WHERE
          external_id = :externalId
          AND external_source = :externalSource
          AND is_deleted = false
      `,
      { email, externalId, externalSource }
    );

    return hasUser && hasUser.length;
  }

  public async findByExternalId(externalId: string, externalSource: string): Promise<LucidRow> {
    return await this.model
      .query()
      .where('external_id', externalId)
      .andWhere('external_source', externalSource)
      .andWhere('is_deleted', false)
      .firstOrFail();
  }
}
