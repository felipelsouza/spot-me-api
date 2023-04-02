import Database from '@ioc:Adonis/Lucid/Database';
import { test } from '@japa/runner';
import { UserFactory } from 'Database/factories/user';

test.group('Create User', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test('It should create a new user', async ({ client, assert }) => {
    const userPayload = await UserFactory.make();

    const response = await client.post('api/v1/users').json(userPayload);

    response.assertStatus(201);
    assert.onlyProperties(response.body(), [
      'id',
      'externalId',
      'externalSource',
      'email',
      'name',
      'createdAt',
      'updatedAt'
    ]);
  });

  test('It should return 409 when email is already in use', async ({ client, assert }) => {
    const { email } = await UserFactory.create();

    const userPayload = await UserFactory.make();
    userPayload.email = email;

    const response = await client.post('api/v1/users').json(userPayload);

    response.assertStatus(409);
    assert.property(response.body(), 'code', 'CONFLICT__USER_ALREADY_EXISTS');
  });

  test('It should return 409 when already exists an user with same externalSource + externalId combination', async ({
    client,
    assert
  }) => {
    const { externalId, externalSource } = await UserFactory.create();

    const validUserPayload = await UserFactory.make();
    validUserPayload.externalId = externalId;

    const invalidUserPayload = await UserFactory.make();
    invalidUserPayload.externalId = externalId;
    invalidUserPayload.externalSource = externalSource;

    const validResponse = await client.post('api/v1/users').json(validUserPayload);
    const invalidResponse = await client.post('api/v1/users').json(invalidUserPayload);

    validResponse.assertStatus(201);
    invalidResponse.assertStatus(409);
    assert.property(invalidResponse.body(), 'code', 'CONFLICT__USER_ALREADY_EXISTS');
  });

  test('It should return 422 when email is not valid', async ({ client, assert }) => {
    const userPayload = await UserFactory.make();
    userPayload.email = 'invalid-email';

    const response = await client.post('api/v1/users').json(userPayload);

    response.assertStatus(422);
    assert.property(response.body(), 'code', 'BAD_REQUEST__INVALID_DATA');
  });
});
