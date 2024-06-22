/* eslint-disable */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async (knex) => {
  await knex("geo_states").del();

  await knex("geo_states").insert([
    { code: "AL", name: "Alabama", country_code: "US" },
    { code: "AK", name: "Alaska", country_code: "US" },
    { code: "AS", name: "American Samoa", country_code: "US" },
    { code: "AZ", name: "Arizona", country_code: "US" },
    { code: "AR", name: "Arkansas", country_code: "US" },
    { code: "CA", name: "California", country_code: "US" },
    { code: "CO", name: "Colorado", country_code: "US" },
    { code: "CT", name: "Connecticut", country_code: "US" },
    { code: "DE", name: "Delaware", country_code: "US" },
    { code: "DC", name: "District of Columbia", country_code: "US" },
    {
      code: "FM",
      name: "Federated geo_states of Micronesia",
      country_code: "US",
    },
    { code: "FL", name: "Florida", country_code: "US" },
    { code: "GA", name: "Georgia", country_code: "US" },
    { code: "GU", name: "Guam", country_code: "US" },
    { code: "HI", name: "Hawaii", country_code: "US" },
    { code: "ID", name: "Idaho", country_code: "US" },
    { code: "IL", name: "Illinois", country_code: "US" },
    { code: "IN", name: "Indiana", country_code: "US" },
    { code: "IA", name: "Iowa", country_code: "US" },
    { code: "KS", name: "Kansas", country_code: "US" },
    { code: "KY", name: "Kentucky", country_code: "US" },
    { code: "LA", name: "Louisiana", country_code: "US" },
    { code: "ME", name: "Maine", country_code: "US" },
    { code: "MH", name: "Marshall Islands", country_code: "US" },
    { code: "MD", name: "Maryland", country_code: "US" },
    { code: "MA", name: "Massachusetts", country_code: "US" },
    { code: "MI", name: "Michigan", country_code: "US" },
    { code: "MN", name: "Minnesota", country_code: "US" },
    { code: "MS", name: "Mississippi", country_code: "US" },
    { code: "MO", name: "Missouri", country_code: "US" },
    { code: "MT", name: "Montana", country_code: "US" },
    { code: "NE", name: "Nebraska", country_code: "US" },
    { code: "NV", name: "Nevada", country_code: "US" },
    { code: "NH", name: "New Hampshire", country_code: "US" },
    { code: "NJ", name: "New Jersey", country_code: "US" },
    { code: "NM", name: "New Mexico", country_code: "US" },
    { code: "NY", name: "New York", country_code: "US" },
    { code: "NC", name: "North Carolina", country_code: "US" },
    { code: "ND", name: "North Dakota", country_code: "US" },
    { code: "MP", name: "Northern Mariana Islands", country_code: "US" },
    { code: "OH", name: "Ohio", country_code: "US" },
    { code: "OK", name: "Oklahoma", country_code: "US" },
    { code: "OR", name: "Oregon", country_code: "US" },
    { code: "PW", name: "Palau", country_code: "US" },
    { code: "PA", name: "Pennsylvania", country_code: "US" },
    { code: "PR", name: "Puerto Rico", country_code: "US" },
    { code: "RI", name: "Rhode Island", country_code: "US" },
    { code: "SC", name: "South Carolina", country_code: "US" },
    { code: "SD", name: "South Dakota", country_code: "US" },
    { code: "TN", name: "Tennessee", country_code: "US" },
    { code: "TX", name: "Texas", country_code: "US" },
    { code: "UT", name: "Utah", country_code: "US" },
    { code: "VT", name: "Vermont", country_code: "US" },
    { code: "VI", name: "Virgin Islands", country_code: "US" },
    { code: "VA", name: "Virginia", country_code: "US" },
    { code: "WA", name: "Washington", country_code: "US" },
    { code: "WV", name: "West Virginia", country_code: "US" },
    { code: "WI", name: "Wisconsin", country_code: "US" },
    { code: "WY", name: "Wyoming", country_code: "US" },
  ]);

  await knex("geo_states").insert([
    { code: "BC", name: "British Columbia", country_code: "CA" },
  ]);

  await knex("geo_states").insert([
    { code: "Tachov", name: "Tachov", country_code: "CZ" },
  ]);

  await knex("geo_states").insert([
    { code: "Nagano", name: "Nagano", country_code: "JP" },
  ]);

  await knex("geo_states").insert([
    { code: "Bergamo", name: "Bergamo", country_code: "IT" },
  ]);
};
