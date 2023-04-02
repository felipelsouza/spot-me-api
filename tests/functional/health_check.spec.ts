import { test } from '@japa/runner';

test('Check database availability', async ({ client }) => {
  const response = await client.get('api/v1/health-check');

  response.assertStatus(200);
  response.assertBodyContains({ message: 'Connection is healthy' });
});
