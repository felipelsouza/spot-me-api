import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class SocialUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    socialUser: schema.object().members({
      externalId: schema.string({}, [rules.required()]),
      externalSource: schema.string({}, [rules.required()]),
      email: schema.string({}, [rules.email(), rules.required()]),
      name: schema.string({}, [rules.required()]),
      avatar: schema.string({}, [rules.url()])
    }),
    socialToken: schema.object().members({
      token: schema.string({}, [rules.required()]),
      refreshToken: schema.string({}, [rules.required()]),
      expiresIn: schema.number([rules.required()]),
      tokenType: schema.string({}, [rules.required()])
    })
  });

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    'externalId.required': this.ctx.i18n.formatMessage('common.requiredField', { field: 'externalId' }),
    'externalSource.required': this.ctx.i18n.formatMessage('common.requiredField', { field: 'externalSource' }),
    'email.required': this.ctx.i18n.formatMessage('common.requiredField', { field: 'email' }),
    'email.email': this.ctx.i18n.formatMessage('common.invalidFieldFormat', { field: 'email' }),
    'name.required': this.ctx.i18n.formatMessage('common.requiredField', { field: 'name' }),
    'avatar.url': this.ctx.i18n.formatMessage('common.invalidFieldFormat', { field: 'avatar' })
  };
}
