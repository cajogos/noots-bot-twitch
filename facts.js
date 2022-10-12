import fs from 'fs';

const facts = loadFacts();

function loadFacts()
{
    return JSON.parse(fs.readFileSync('./data/facts.json')).facts;
}

function randomFact()
{
    return facts[Math.floor(Math.random() * facts.length)];
}

export { randomFact };