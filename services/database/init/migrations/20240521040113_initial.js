/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.dropTableIfExists("faces");
  await knex.schema.dropTableIfExists("subjects");
  await knex.schema.dropTableIfExists("media");
  // await knex.schema.hasTable('media')

  await knex.schema.createTable("media", (table) => {
    table.increments("id").unsigned().notNullable().primary();
    table.string("path").unique().notNullable();
    //
    table.json("exif");
    //
    table.timestamps(true, true, true);
  });

  await knex.schema.createTable("subjects", (table) => {
    table.increments("id").unsigned().notNullable().primary();
    //
    table.string("first_name");
    table.string("last_name");
    table.string("middle_name");
    table.string("maiden_name");
    table.string("suffix");
    //
    table.timestamps(true, true, true);
  });

  await knex.schema.createTable("faces", (table) => {
    table.increments("id").unsigned().notNullable().primary();
    table.string("path").unique().notNullable();
    table.boolean("verified").defaultTo(false).notNullable();
    table.float("similarity", 7, 6).defaultTo(null);
    table.json("data").defaultTo(null);
    //
    table
      .integer("media_id")
      .unsigned()
      .references("id")
      .inTable("media")
      .onDelete("CASCADE");
    table
      .integer("subject_id")
      .unsigned()
      .references("id")
      .inTable("subjects")
      .onDelete("CASCADE");
    //
    table.timestamps(true, true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("faces");
  await knex.schema.dropTableIfExists("subjects");
  await knex.schema.dropTableIfExists("media");
};
