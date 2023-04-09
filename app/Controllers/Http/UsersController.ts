import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';
import ClientException from 'App/Exceptions/ClientException';
import User from 'App/Models/User';
import CreateUserValidator from 'App/Validators/CreateUserValidator';
import UpdateUserValidator from 'App/Validators/UpdateUserValidator';

export default class UsersController {
  public async store({ request, response }: HttpContextContract) {
    const userPayload = await request.validate(CreateUserValidator);

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
      {
        email: userPayload.email,
        externalId: userPayload.externalId,
        externalSource: userPayload.externalSource
      }
    );

    if (hasUser && hasUser.length) {
      throw new ClientException('users.alreadyExists', 409, 'CONFLICT__USER_ALREADY_EXISTS');
    }

    const createdUser = await User.create(userPayload);

    return response.created(createdUser);
  }

  public async update({ request, response }: HttpContextContract) {
    const { externalSource, name, email } = await request.validate(UpdateUserValidator);
    const externalId = request.param('externalId');

    const user = await User.query()
      .where('external_id', externalId)
      .andWhere('external_source', externalSource)
      .andWhere('is_deleted', false)
      .firstOrFail();

    await user.merge({ name, email }).save();

    return response.ok(user);
  }
}
