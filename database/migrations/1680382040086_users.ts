import BaseSchema from '@ioc:Adonis/Lucid/Schema';
import MigrationsHelper from 'Database/utils/MigrationsHelper';

export default class extends BaseSchema {
  protected tableName = 'users';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id', { primaryKey: true });

      table.string('external_id', 36).notNullable();
      table.string('external_source', 120).notNullable();

      table.string('name', 255).notNullable();
      table.string('email', 255).notNullable().unique();

      MigrationsHelper.createAuditoryFields(table);

      table.index(['external_id', 'external_source'], 'idx_users_external_id_external_source');

      table.unique(['external_id', 'external_source'], {
        indexName: 'un_users_external_id_external_source',
        predicate: this.knex().whereRaw('is_deleted = false')
      });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
