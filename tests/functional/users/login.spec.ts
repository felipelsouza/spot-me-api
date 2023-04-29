import Database from '@ioc:Adonis/Lucid/Database';
import { test } from '@japa/runner';
import { UserFactory } from 'Database/factories/user';
import SocialAuthenticationMock from '../mocks/SocialAuthentication';

test.group('User login', async (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test('It should create a session for the created/updated user and return the authorization token', async ({
    client,
    assert
  }) => {
    const user = await UserFactory.make();
    const socialAuthenticationMock = new SocialAuthenticationMock(user);
    const response = await client.get(`api/v1/external-source/${user.externalSource}/users/auth`);

    response.assertStatus(200);
    assert.onlyProperties(response.body().authorization, ['type', 'token', 'expiresAt']);

    socialAuthenticationMock.restore();
  });

  test('It should sign out user from session and return 200', async ({ client }) => {
    const user = await UserFactory.make();
    const socialAuthenticationMock = new SocialAuthenticationMock(user);
    const authentication = await client.get(`api/v1/external-source/${user.externalSource}/users/auth`);

    const authorization = authentication.body().authorization;

    const response = await client.delete('api/v1/users/auth').header('Authorization', `Bearer ${authorization.token}`);

    response.assertStatus(200);

    socialAuthenticationMock.restore();
  });

  test('it should revoke the authorization token when user signs out', async ({ client, assert }) => {
    const user = await UserFactory.make();
    const socialAuthenticationMock = new SocialAuthenticationMock(user);
    const authentication = await client.get(`api/v1/external-source/${user.externalSource}/users/auth`);

    const authorization = authentication.body().authorization;

    await client.delete('api/v1/users/auth').header('Authorization', `Bearer ${authorization.token} `);

    const token = await Database.query().select('id').from('api_tokens').where('token', authorization.token);
    assert.isEmpty(token);

    socialAuthenticationMock.restore();
  });
});
