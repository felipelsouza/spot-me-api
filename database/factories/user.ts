import Factory from '@ioc:Adonis/Lucid/Factory';
import User from 'App/Models/User';

export const UserFactory = Factory.define(User, ({ faker }) => {
  const externalSources = ['spotify'];

  return {
    externalId: faker.datatype.uuid(),
    externalSource: externalSources[Math.floor(Math.random() * externalSources.length)],
    name: faker.name.fullName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar()
  };
}).build();
