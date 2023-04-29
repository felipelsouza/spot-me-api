import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import SocialUser from 'App/Validators/SocialUserValidator';
import UpsertUser from 'App/UseCases/User/Upsert';
import AuthenticateUser from 'App/UseCases/User/Authenticate';

export default class UsersController {
  public async auth({ request, response, auth }: HttpContextContract): Promise<void> {
    const { socialUser, socialToken } = await request.validate(SocialUser);

    const user = await UpsertUser.execute(socialUser);
    const authorization = await AuthenticateUser.execute(auth, user, socialToken);

    return response.ok({ user, authorization });
  }

  public async signOut({ response, auth }: HttpContextContract): Promise<void> {
    await auth.logout();

    return response.ok({});
  }
}
