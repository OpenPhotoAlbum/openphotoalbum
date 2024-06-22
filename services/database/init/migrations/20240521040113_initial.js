const fs = require("fs");
const path = require("path");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // await knex.schema.hasTable('media')
  await knex.schema.dropTableIfExists("faces");
  await knex.schema.dropTableIfExists("subjects");
  await knex.schema.dropTableIfExists("media");
  await knex.schema.dropTableIfExists("geo_cities");
  await knex.schema.dropTableIfExists("geo_states");
  await knex.schema.dropTableIfExists("geo_countries");

  await knex.schema.createTable("geo_countries", (table) => {
    table.increments("id").unsigned().primary().notNullable();
    table.varchar("phone_code");
    table.varchar("country_code", 2).notNullable().unique();
    table.varchar("iso3", 3).unique();
    table.varchar("country_name", 80).notNullable().unique();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table
      .timestamp("modified_at")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
  });

  await knex.schema.createTable("geo_states", (table) => {
    table.increments("id").unsigned().primary().notNullable();
    table.varchar("code", 18).notNullable().defaultTo("").unique();
    table.varchar("name", 128).notNullable().unique().defaultTo("");
    table
      .varchar("country_code", 2)
      .notNullable()
      .references("country_code")
      .inTable("geo_countries")
      .onDelete("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table
      .timestamp("modified_at")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
  });

  await knex.raw(
    fs.readFileSync(path.join(__dirname, "./raw/07-geo-cities.sql"), "utf8")
  );

  await knex.schema.createTable("media", (table) => {
    table.increments("id").unsigned().notNullable().primary();
    table.string("path").unique().notNullable();
    table
      .integer("city_id", 255)
      .references("id")
      .inTable("geo_cities")
      .onDelete("CASCADE");
    //
    table.json("exif");
    table.boolean("screenshot").defaultTo(null);
    table.datetime("date_time_original");
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
  await knex.schema.dropTableIfExists("geo_cities");
  await knex.schema.dropTableIfExists("geo_states");
  await knex.schema.dropTableIfExists("geo_countries");
};
