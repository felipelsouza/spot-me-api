import Route from '@ioc:Adonis/Core/Route';

Route.get('/external-source/:externalSource/users/auth', 'UsersController.auth').middleware('socialAuth');

Route.where('externalSource', /spotify/s);
Route.where('externalId', /^[a-zA-Z0-9-_]+$/);
