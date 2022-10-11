import { RefreshingAuthProvider } from '@twurple/auth';
import { ChatClient } from '@twurple/chat';
import { ApiClient, ChattersList } from '@twurple/api';
import { promises as fs } from 'fs';
import fetch from 'node-fetch';

import { clientId, clientSecret } from './credentials.js';
import { randomFact } from './facts.js';
import { getGeneralJoke, getKnockKnockJoke, getProgrammingJoke, getDadJoke, getPokemonJoke } from './jokes.js';

const tokensFile = './tokens.json';
const fileEncoding = 'UTF-8';
const trackedChannels = [
    'pudgyycat',
    'kingmcewan',
    'cajogos',
    'yeekaycrafts',
    'lifeofbeard',
    'motleyverse',
    // 'mrricardo94',
    'karrantula'
];

const vipUsers = [
    'karrantula'
];

// Get a list of random foods
async function getRandomFood()
{
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const data = await response.json();
    return data.meals[0];
}

async function main()
{
    const tokenData = JSON.parse(await fs.readFile(tokensFile, fileEncoding));

    const authProvider = new RefreshingAuthProvider({
        clientId,
        clientSecret,
        onRefresh: async newTokenData => await fs.writeFile(
            tokensFile,
            JSON.stringify(newTokenData, null, 4),
            fileEncoding
        )
    }, tokenData);

    const chatClient = new ChatClient({
        authProvider,
        channels: trackedChannels
    });

    const apiClient = new ApiClient({ authProvider });

    chatClient.onRaid((channel, user, raidInfo) =>
    {
        let message = '';
        if (raidInfo.viewerCount === 1)
        {
            message = `Thanks for popping by @${user}!`;
        }
        else
        {
            message = `Thanks for bringing ${raidInfo.viewerCount} friends! @${user}!`;
        }
        chatClient.say(channel, message);
    });

    chatClient.onMessage(async (channel, username, text) =>
    {
        console.log(`[${channel}] ${username}: ${text}`);

        // Yeeks what's for tea!
        if (text.includes('yeekayTea'))
        {
            const food = await getRandomFood();
            chatClient.say(channel, `@${username} how about ${food.strMeal}? Kappa`);
        }

        // Random fact
        if (text === '!fact')
        {
            chatClient.say(channel, `@${username} Here is a random fact: ` + randomFact());
        }

        // Random joke
        if (text.startsWith('!joke'))
        {
            let parts = text.split(' ');

            let joke = null;
            switch (parts[1])
            {
                case 'pokemon':
                    joke = getPokemonJoke();
                    break;
                case 'knockknock':
                    joke = getKnockKnockJoke();
                    break;
                case 'programming':
                    joke = getProgrammingJoke();
                    break;
                case 'dad':
                    joke = getDadJoke();
                    break;
                default:
                    joke = getGeneralJoke();
                    break;
            }

            let message = `@${username} ${joke.setup} ${joke.punchline}`;
            chatClient.say(channel, message);
        }

        // NOOT NOOT!
        let nootKeywords = [
            'nootnoot',
            'noot noot',
            'cajogoNootHYPE',
            'cajogoNootNoot'
        ];
        let shouldNoot = false;
        nootKeywords.forEach(keyword =>
        {
            if (text.toLowerCase().includes(keyword))
            {
                shouldNoot = true;
            }
        });
        if (shouldNoot)
        {
            chatClient.say(channel, 'NOOT NOOT!');
        }

        // Good luck pokecatch!
        if (text.startsWith('!pokecatch'))
        {
            chatClient.say(channel,
                `Good luck with the catch @${username}! PowerUpL GlitchCat PowerUpR`
            );
        }

        // Shameless cajogos promo
        if (text.startsWith('!cajogos'))
        {
            chatClient.say(channel, `Find out more: https://cajogos.stream`);
        }

    });

    await chatClient.connect();
}

main();
