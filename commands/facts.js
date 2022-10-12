import fs from 'fs';

const facts = loadFacts();

/**
 * @returns {string[]}
 */
function loadFacts()
{
    return JSON.parse(fs.readFileSync('./data/facts.json')).facts;
}

/**
 * @returns {string}
 */
function randomFact()
{
    return facts[Math.floor(Math.random() * facts.length)];
}

export { randomFact };