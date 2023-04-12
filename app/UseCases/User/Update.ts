import { LucidRow } from '@ioc:Adonis/Lucid/Orm';
import UserService from 'App/Services/UserService';

interface UpdateUserRequest {
  name: string;
  email: string;
  externalId: string;
  externalSource: string;
}

export default class UpdateUser {
  public static async execute(userData: UpdateUserRequest): Promise<LucidRow> {
    const userService = new UserService();

    const user = await userService.findByExternalId(userData.externalId, userData.externalSource);

    return await userService.update(user, { name: userData.name, email: userData.email });
  }
}
