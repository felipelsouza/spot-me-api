import Route from '@ioc:Adonis/Core/Route';

Route.get('/spotify/auth', async ({ ally }) => {
  return ally.use('spotify').redirect();
});
