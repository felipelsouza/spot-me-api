import Database from '@ioc:Adonis/Lucid/Database';
import { test } from '@japa/runner';

test.group('Social authenticate User', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test('It should return 404 when the external source does not exists', async ({ client, assert }) => {
    const invalidExternalSource = 'invalid-external-source';
    const response = await client.get(`api/v1/external-source/${invalidExternalSource}/users/auth`);

    response.assertStatus(404);
    assert.property(response.body(), 'message');
    assert.include(response.body().message, 'E_ROUTE_NOT_FOUND');
  });

  test('It should return 401 when the spotify access is denied', async ({ client, assert }) => {
    const error = 'access_denied';

    const response = await client.get(`api/v1/external-source/spotify/users/auth?error=${error}`);

    response.assertStatus(401);
    assert.property(response.body(), 'code');
    assert.include(response.body().code, 'UNAUTHORIZED__ACCESS_DENIED');
  });
});
