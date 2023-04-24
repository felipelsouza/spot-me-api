import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import SocialAuthentication from 'App/Middleware/SocialAuthentication';
import User from 'App/Models/User';
import sinon from 'sinon';

export default class SocialAuthenticationMock {
  public stub: sinon.SinonStub<[HttpContextContract, () => Promise<void>], Promise<void>>;

  constructor(userData: User) {
    this.stub = sinon
      .stub(SocialAuthentication.prototype, 'handle')
      .callsFake(async ({ request }: HttpContextContract, next: () => Promise<void>) => {
        request.updateBody(userData);
        await next();
      });
  }

  public restore(): void {
    this.stub.restore();
  }
}
