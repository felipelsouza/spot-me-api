import Database from '@ioc:Adonis/Lucid/Database';
import { test } from '@japa/runner';
import { UserFactory } from 'Database/factories/user';
import SocialAuthenticationMock from '../mocks/SocialAuthentication';

test.group('Upsert User', async (group) => {
  const returnBodyDefaultItems = ['id', 'externalId', 'externalSource', 'email', 'name', 'avatar'];

  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test('It should create a new user when the user does not exists', async ({ client, assert }) => {
    const user = await UserFactory.make();
    const socialAuthenticationMock = new SocialAuthenticationMock(user);
    const response = await client.get(`api/v1/external-source/${user.externalSource}/users/auth`);

    response.assertStatus(200);
    assert.onlyProperties(response.body(), returnBodyDefaultItems);

    socialAuthenticationMock.restore();
  });

  test('It should update an existing user', async ({ client, assert }) => {
    const { externalId, externalSource } = await UserFactory.create();

    const userToUpdate = await UserFactory.merge({ externalId, externalSource }).make();

    const socialAuthenticationMock = new SocialAuthenticationMock(userToUpdate);

    const response = await client.get(`api/v1/external-source/${userToUpdate.externalSource}/users/auth`);

    response.assertStatus(200);
    assert.onlyProperties(response.body(), returnBodyDefaultItems);
    assert.property(response.body(), 'email', userToUpdate.email);
    assert.property(response.body(), 'name', userToUpdate.name);
    assert.property(response.body(), 'avatar', userToUpdate.avatar);

    socialAuthenticationMock.restore();
  });

  test('It should return 422 when email is not valid', async ({ client, assert }) => {
    const userPayload = await UserFactory.merge({ email: 'invalid-email' }).make();

    const socialAuthenticationMock = new SocialAuthenticationMock(userPayload);

    const response = await client.get(`api/v1/external-source/${userPayload.externalSource}/users/auth`);

    response.assertStatus(422);
    assert.property(response.body(), 'code', 'BAD_REQUEST__INVALID_DATA');

    socialAuthenticationMock.restore();
  });
});
