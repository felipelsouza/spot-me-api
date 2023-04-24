import ClientException from 'App/Exceptions/ClientException';
import { SocialProviders } from '@ioc:Adonis/Addons/Ally';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class SocialAuthentication {
  public async handle({ request, ally }: HttpContextContract, next: () => Promise<void>): Promise<void> {
    const externalSource = request.param('externalSource');
    const authenticationDriver: SocialProviders[keyof SocialProviders]['implementation'] = ally.use(externalSource);

    if (!authenticationDriver) {
      throw new ClientException('socialAuth.driverNotFound', 404, 'NOT_FOUND__DRIVER_NOT_FOUND');
    }

    if (authenticationDriver.accessDenied()) {
      throw new ClientException('socialAuth.accessDenied', 401, 'UNAUTHORIZED__ACCESS_DENIED');
    }

    if (authenticationDriver.stateMisMatch()) {
      throw new ClientException('socialAuth.stateMisMatch', 401, 'UNAUTHORIZED__STATE_MISMATCH');
    }

    if (authenticationDriver.hasError()) {
      throw new ClientException('socialAuth.hasError', 401, 'UNAUTHORIZED__HAS_ERROR');
    }

    const user = await authenticationDriver.user();

    request.updateBody({
      externalSource,
      externalId: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatarUrl
    });

    await next();
  }
}
