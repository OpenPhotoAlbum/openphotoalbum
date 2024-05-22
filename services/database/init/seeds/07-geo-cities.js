/* eslint-disable */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const fs = require("fs");
const path = require("path");

exports.seed = async (knex) => {
  await knex("geo_cities").del();

  await knex.raw(
    fs.readFileSync(
      path.join(__dirname, "./raw/geo_cities_2023-04-11_235112.sql"),
      "utf8"
    )
  );
};
