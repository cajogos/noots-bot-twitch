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

        console.log(data);

        const speciesName = data.name.charAt(0).toUpperCase() + data.name.slice(1);
        let dexInfo = `${speciesName} (#${data.id})`;
        if (data.types.length === 2)
        {
            dexInfo += ` is a ${data.types[0].type.name} and ${data.types[1].type.name} type`;
        }
        else
        {
            dexInfo += ` is a ${data.types[0].type.name} type`;
        }
        dexInfo += ` pokemon. It has a height of ${data.height / 10}m and a weight of ${data.weight / 10}kg.`;

        switch (data.id)
        {
            case 39:
                dexInfo += ` JIGGLY!`;
                break;
            case 69:
                dexInfo += ' Hehe 69, nice! Kappa';
                break;
            case 249:
                dexInfo += ` cajogoLugia cajogoLugia cajogoLugia `;
                break;
            case 420:
                dexInfo += ' Blaze it! \u{1F525}';
                break;
        }

        return dexInfo;
    }

    return `I couldn't find that entry in the pokedex!`;
}

export { getPokedexEntry };
