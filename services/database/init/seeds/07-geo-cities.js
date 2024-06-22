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

  await knex("geo_cities").insert([
    {
      postal_code: "CJFM+777",
      latitude: 48.4231,
      longitude: -123.3668,
      city: "Victoria",
      state_code: "BC",
      county_name: "Victoria",
      county_names_all: "Victoria",
      timezone: "America/Los_Angeles",
    },
  ]);

  await knex("geo_cities").insert([
    {
      postal_code: "QMQ3+Q36",
      latitude: 49.794575,
      longitude: 12.630797,
      city: "Tachov",
      state_code: "Tachov",
      county_name: "Tachov",
      county_names_all: "Tachov",
      timezone: "Europe/Prague",
    },
  ]);

  await knex("geo_cities").insert([
    {
      postal_code: "6XM9+VWW",
      latitude: 36.23473,
      longitude: 137.9698194,
      city: "Matsumoto",
      state_code: "Nagano",
      county_name: "Nagano",
      county_names_all: "Nagano",
      timezone: "Japan",
    },
  ]);

  await knex("geo_cities").insert([
    {
      postal_code: "24060",
      latitude: 45.7431722,
      longitude: 9.95054166666667,
      city: "Monasterolo del Castello",
      state_code: "Bergamo",
      county_name: "Bergamo",
      county_names_all: "Bergamo",
      timezone: "Europe/Rome",
    },
  ]);
};
