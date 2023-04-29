import { AllyUserContract, Oauth1AccessToken, Oauth2AccessToken } from '@ioc:Adonis/Addons/Ally';
import { AuthContract } from '@ioc:Adonis/Addons/Auth';
import TokenContract from 'App/Interfaces/TokenContract';
import User from 'App/Models/User';

export default class AuthenticateUser {
  public static async execute(
    auth: AuthContract,
    user: User,
    token: Partial<AllyUserContract<Oauth1AccessToken | Oauth2AccessToken>['token']>
  ): Promise<TokenContract> {
    const authorization = await auth.use('api').generate(user, {
      expiresIn: token.expiresIn
    });

    return {
      type: authorization.type,
      token: authorization.token,
      expiresAt: authorization.expiresAt
    };
  }
}
