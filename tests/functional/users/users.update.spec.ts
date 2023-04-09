import Database from '@ioc:Adonis/Lucid/Database';
import { test } from '@japa/runner';
import { UserFactory } from 'Database/factories/user';

test.group('Update User', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test('It should update an existing user', async ({ client, assert }) => {
    const { externalId, externalSource } = await UserFactory.create();

    const userPayload = {
      externalSource,
      email: 'updated-email@test.com',
      name: 'Updated Name'
    };

    const response = await client.put(`api/v1/users/${externalId}`).json(userPayload);

    response.assertStatus(200);
    assert.onlyProperties(response.body(), ['id', 'externalId', 'externalSource', 'email', 'name']);
    assert.property(response.body(), 'email', userPayload.email);
    assert.property(response.body(), 'name', userPayload.name);
  });

  test('It should return 404 when user does not exists', async ({ client, assert }) => {
    const userPayload = await UserFactory.make();

    const response = await client.put('api/v1/users/invalid-external-id').json(userPayload);

    response.assertStatus(404);
    assert.property(response.body(), 'code', 'NOT_FOUND__RESOURCE_NOT_FOUND');
  });

  test('It should return an error when the externalId is invalid', async ({ client, assert }) => {
    const userPayload = await UserFactory.make();

    const response = await client.put('api/v1/users/@').json(userPayload);

    response.assertStatus(404);
    assert.property(response.body(), 'message');
    assert.include(response.body().message, 'E_ROUTE_NOT_FOUND');
  });
});
