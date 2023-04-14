import { LucidRow } from '@ioc:Adonis/Lucid/Orm';
import UserInterface from 'App/Interfaces/User';
import UserService from 'App/Services/UserService';

interface UpdateUserRequest extends UserInterface {}

export default class UpdateUser {
  public static async execute(userData: UpdateUserRequest): Promise<LucidRow> {
    const userService = new UserService();

    const user = await userService.findByExternalId(userData.externalId, userData.externalSource);

    return await userService.update(user, { name: userData.name, email: userData.email });
  }
}
