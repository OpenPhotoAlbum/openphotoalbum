/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("subjects").del(); // Deletes ALL existing entries

  await knex("subjects").insert([
    { id: 1, first_name: "Cayce", last_name: "Young", maiden_name: "Ward" },
    { id: 2, first_name: "Stephen", last_name: "Young" },
    { id: 3, first_name: "Henry", last_name: "Young" },
    { id: 4, first_name: "Margaret", last_name: "Young" },
    { id: 5, first_name: "Amelia", last_name: "Young" },
    { id: 6, first_name: "Guillaume", last_name: "Delloue" },
    {
      id: 7,
      first_name: "Patricia",
      last_name: "Forrence",
      maiden_name: "Chooljian",
    },
    {
      id: 8,
      first_name: "Diane",
      last_name: "McIntosh",
      maiden_name: "Chooljian",
    },
    { id: 9, first_name: "James", last_name: "Mcintosh" },
    {
      id: 10,
      first_name: "Kaitlyn",
      last_name: "Young",
      maiden_name: "Obrien",
    },
    { id: 11, first_name: "Susan", last_name: "Ward", maiden_name: "Haug" },
    { id: 12, first_name: "Bill", last_name: "Ward" },
    { id: 13, first_name: "Christian", last_name: "Ward" },
    { id: 14, first_name: "Austin", last_name: "Ward" },
    {
      id: 15,
      first_name: "Holly",
      last_name: "Tachovsky",
      maiden_name: "Ward",
    },
    { id: 16, first_name: "Andrew", last_name: "Tachovsky" },
    { id: 17, first_name: "Owen", last_name: "Tachovsky" },
    { id: 18, first_name: "Eli", last_name: "Tachovsky" },
    { id: 19, first_name: "David", last_name: "Young" },
    { id: 20, first_name: "Edward", last_name: "Chooljian" },
    { id: 21, first_name: "Dorothy", last_name: "Chooljian" },
    { id: 22, first_name: "Janet", last_name: "Bernson" },
    { id: 23, first_name: "Zoemae", last_name: "Ward" },
    { id: 24, first_name: "Ruth", last_name: "Haug" },
    { id: 25, first_name: "Maggie", last_name: "Ward" },
    { id: 26, first_name: "Levi", last_name: "Ward" },
    { id: 27, first_name: "Julia", last_name: "Parmenter" },
    { id: 28, first_name: "Ch", last_name: "Haug" },
    { id: 29, first_name: "Robert", last_name: "Weiss" },
    { id: 30, first_name: "Phillip", last_name: "Haas" },
    { id: 31, first_name: "Tristan", last_name: "Delloue" },
    { id: 32, first_name: "Evelyn", last_name: "Keohane" },
    { id: 33, first_name: "Diane", last_name: "Haug" },
    { id: 34, first_name: "Ziggy", last_name: "Zane" },
    {
      id: 35,
      first_name: "Debbie",
      last_name: "Sturtevant",
      maiden_name: "Chooljian",
    },
    {
      id: 36,
      first_name: "Lauren",
      last_name: "Delloue",
      maiden_name: "Walstad",
    },
    { id: 37, first_name: "Kim", last_name: "Zane" },
    { id: 38, first_name: "Seb", last_name: "Delloue" },
    { id: 39, first_name: "Oli", last_name: "Delloue" },
    { id: 40, first_name: "Thibaut", last_name: "Delloue" },
    { id: 41, first_name: "Saige", last_name: "Lapierre" },
    { id: 42, first_name: "Greta", last_name: "Garland" },
    { id: 43, first_name: "Erica", maiden_name: "Sturtevant" },
    { id: 44, first_name: "John", last_name: "Forrence" },
    { id: 45, first_name: "Kk", last_name: "Greer" },
    { id: 46, first_name: "Stephen", last_name: "Young", middle_name: "David" },
    { id: 47, first_name: "Kian", last_name: "Keohane" },
    { id: 48, first_name: "Miss", last_name: "Collette" },
    { id: 49, first_name: "Hannah", last_name: "Murray" },
    { id: 50, first_name: "Ian", last_name: "Murray" },
    { id: 51, first_name: "Daniel", last_name: "Sturtevant" },
    { id: 52, first_name: "Dmitri", last_name: "Tsentalovich" },
    { id: 53, first_name: "Lorra", last_name: "Tsentalovich" },
    { id: 54, first_name: "Igor", last_name: "Tsentalovich" },
    { id: 55, first_name: "David", last_name: "Samra" },
    { id: 56, first_name: "Thomas", last_name: "B" },
    { id: 57, first_name: "Catherine", last_name: "Delloue" },
    { id: 58, first_name: "Pascal", last_name: "Delloue" },
    { id: 59, first_name: "Thomas", last_name: "Malone" },
    { id: 60, first_name: "Evan", last_name: "Mora" },
    { id: 61, first_name: "Mary", last_name: "Jane" },
    { id: 62, first_name: "Donna", maiden_name: "Chooljian" },
    {
      id: 63,
      first_name: "Mary",
      last_name: "Dizazzo",
      maiden_name: "Chooljian",
    },
    { id: 64, first_name: "Michael", last_name: "Dizazzo" },
    { id: 65, first_name: "Bobby", last_name: "Dizazzo" },
    { id: 66, first_name: "Billy", last_name: "Dizazzo" },
    { id: 67, first_name: "Johnny", last_name: "Dizazzo" },
    { id: 68, first_name: "William", last_name: "Ward" },
  ]);
};