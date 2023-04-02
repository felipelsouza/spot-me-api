import Factory from '@ioc:Adonis/Lucid/Factory';
import User from 'App/Models/User';

export const UserFactory = Factory.define(User, ({ faker }) => {
  return {
    externalId: faker.datatype.uuid(),
    externalSource: faker.name.firstName(),
    name: faker.name.fullName(),
    email: faker.internet.email()
  };
}).build();
