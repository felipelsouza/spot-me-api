import { LucidRow } from '@ioc:Adonis/Lucid/Orm';
import UserInterface from 'App/Interfaces/User';
import UserService from 'App/Services/UserService';

export default class AuthenticateAndUpsertUser {
  public static async execute(userData: UserInterface): Promise<LucidRow> {
    const userService = new UserService();

    let user = await userService.findByExternalId(userData.externalId, userData.externalSource);

    if (user) {
      user = await userService.update(user, {
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar
      });
    } else {
      user = await userService.create(userData);
    }

    return user;
  }
}
