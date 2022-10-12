import fs from 'fs';

const jokes = loadJokes();

/**
 * @returns {object}
 */
function loadJokes()
{
    const jokeFiles = fs.readdirSync('./data/jokes');
    let jokes = {};
    jokeFiles.forEach(file =>
    {
        const jokeData = JSON.parse(fs.readFileSync(`./data/jokes/${file}`));
        let type = file.split('.')[0];
        jokeData.jokes.forEach(joke =>
        {
            if (!jokes[type])
            {
                jokes[type] = [];
            }
            jokes[type].push(joke);
        });
    });

    return jokes;
}

/**
* @param {string} type
*/
function getJoke(type = null)
{
    if (type === null) type = 'general';

    type = type.trim().toLowerCase();
    if (typeof jokes[type] === 'undefined') type = 'general';

    return jokes[type][Math.floor(Math.random() * jokes[type].length)];
}

export { getJoke };
