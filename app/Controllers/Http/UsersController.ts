import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import AuthenticateAndUpsertUser from 'App/UseCases/User/AuthenticateAndUpsert';
import SocialUser from 'App/Validators/SocialUserValidator';

export default class UsersController {
  public async auth({ request, response }: HttpContextContract): Promise<void> {
    const socialUser = await request.validate(SocialUser);

    const user = await AuthenticateAndUpsertUser.execute(socialUser);

    return response.ok(user);
  }
}
