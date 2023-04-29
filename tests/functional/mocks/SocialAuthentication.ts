import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { faker } from '@faker-js/faker';
import sinon from 'sinon';
import SocialAuthentication from 'App/Middleware/SocialAuthentication';
import User from 'App/Models/User';

export default class SocialAuthenticationMock {
  public stub: sinon.SinonStub<[HttpContextContract, () => Promise<void>], Promise<void>>;

  constructor(userData: User) {
    this.stub = sinon
      .stub(SocialAuthentication.prototype, 'handle')
      .callsFake(async ({ request }: HttpContextContract, next: () => Promise<void>) => {
        request.updateBody({
          socialUser: userData,
          socialToken: {
            token: faker.datatype.uuid(),
            refreshToken: faker.datatype.uuid(),
            expiresIn: 3600,
            tokenType: 'api'
          }
        });

        await next();
      });
  }

  public restore(): void {
    this.stub.restore();
  }
}
