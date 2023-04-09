import Route from '@ioc:Adonis/Core/Route';

Route.post('/users', 'UsersController.store');
Route.put('/users/:externalId', 'UsersController.update');

Route.where('externalId', /^[a-zA-Z0-9-_]+$/);
