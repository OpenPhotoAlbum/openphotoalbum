/* eslint-disable */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async (knex) => {
    await knex('geo_countries').del();
    
    await knex('geo_countries').insert([
        { phone_code: 1, country_code: 'CA', country_name: "Canada"},
        { phone_code: 1, country_code: 'US', country_name: "United States"},
        { phone_code: 31, country_code: 'NL', country_name: "Netherlands"},
        { phone_code: 52, country_code: 'MX', country_name: "Mexico"},
        { phone_code: 44, country_code: 'GB', country_name: "United Kingdom"},
    ]);
  };
  