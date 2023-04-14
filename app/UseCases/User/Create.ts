import { LucidRow } from '@ioc:Adonis/Lucid/Orm';
import ClientException from 'App/Exceptions/ClientException';
import UserInterface from 'App/Interfaces/User';
import UserService from 'App/Services/UserService';

interface CreateUserRequest extends UserInterface {}

export default class CreateUser {
  public static async execute(userData: CreateUserRequest): Promise<LucidRow> {
    const userService = new UserService();

    const hasUser = await userService.findHasUserByEmailAndExternalId(
      userData.email,
      userData.externalId,
      userData.externalSource
    );

    if (hasUser) {
      throw new ClientException('users.alreadyExists', 409, 'CONFLICT__USER_ALREADY_EXISTS');
    }

    return await userService.create(userData);
  }
}
