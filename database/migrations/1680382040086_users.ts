import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'users';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table.string('external_id', 36).notNullable();
      table.string('external_source', 120).notNullable();

      table.string('name', 255).notNullable();
      table.string('email', 255).notNullable().unique();

      table.boolean('is_deleted').notNullable().defaultTo(false);
      table.timestamp('deleted_at', { useTz: true });

      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });

      table.unique(['external_id', 'external_source'], {
        predicate: this.knex().whereRaw('is_deleted = false')
      });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
