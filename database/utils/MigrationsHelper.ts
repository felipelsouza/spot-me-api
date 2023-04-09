import { Knex } from 'knex';

export default class MigrationsHelper {
  public static createAuditoryFields(table: Knex.TableBuilder, hasLogicalDelete: boolean = true): void {
    if (hasLogicalDelete) {
      table.boolean('is_deleted').notNullable().defaultTo(false);
      table.timestamp('deleted_at', { useTz: true });
    }

    table.timestamp('created_at', { useTz: true });
    table.timestamp('updated_at', { useTz: true });
  }
}
