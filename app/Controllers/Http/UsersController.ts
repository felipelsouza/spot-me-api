import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import CreateUser from 'App/UseCases/User/Create';
import UpdateUser from 'App/UseCases/User/Update';
import CreateUserValidator from 'App/Validators/CreateUserValidator';
import UpdateUserValidator from 'App/Validators/UpdateUserValidator';

export default class UsersController {
  public async store({ request, response }: HttpContextContract) {
    const userPayload = await request.validate(CreateUserValidator);

    const createdUser = await CreateUser.execute(userPayload);

    return response.created(createdUser);
  }

  public async update({ request, response }: HttpContextContract) {
    const userPayload = await request.validate(UpdateUserValidator);
    const externalId = request.param('externalId');

    const updatedUser = await UpdateUser.execute({ ...userPayload, externalId });

    return response.ok(updatedUser);
  }
}
