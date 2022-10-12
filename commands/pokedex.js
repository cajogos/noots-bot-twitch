import fetch from 'node-fetch';

/**
 * @param {string} pokedexEntry
 * @returns {string}
 */
async function getPokedexEntry(pokedexEntry)
{
    pokedexEntry = pokedexEntry.trim().toLowerCase();

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokedexEntry}`);

    if (response.ok)
    {
        const data = await response.json();
        return `${data.species.name} (#${data.id}) is a ${data.types[0].type.name} type pokemon.`;
    }

    return `I couldn't find that entry in the pokedex!`;
}

export { getPokedexEntry };
