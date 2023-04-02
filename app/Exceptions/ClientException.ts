import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { Exception } from '@adonisjs/core/build/standalone';

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new BadRequestException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class ClientException extends Exception {
  public async handle(error: this, context: HttpContextContract) {
    const errorCode = error.code?.toString() || '';
    const messagePath = error.message.replace(`${errorCode}: `, '');

    const message = context.i18n.formatMessage(messagePath);

    context.response.status(error.status || 400).send({
      code: error.code || 'BAD_REQUEST',
      message: message
    });
  }
}
