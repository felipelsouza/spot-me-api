import UserInterface from 'App/Interfaces/User';
import User from 'App/Models/User';
import UserService from 'App/Services/UserService';

export default class UpsertUser {
  public static async execute(userData: UserInterface): Promise<User> {
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

    return <User>user;
  }
}
