import { test } from '@japa/runner';

test('Check application availability', async ({ client }) => {
  const response = await client.get('/health-check');

  response.assertStatus(200);
  response.assertBodyContains({ status: 'OK' });
});
