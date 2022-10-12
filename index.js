import { RefreshingAuthProvider } from '@twurple/auth';
import { ChatClient } from '@twurple/chat';
import { ApiClient } from '@twurple/api';
import { promises as fs } from 'fs';

// Commands
import { randomFact } from './commands/facts.js';
import { getJoke } from './commands/jokes.js';
import { randomFood } from './commands/food.js';
import { getPokedexEntry } from './pokedex.js'; // TODO: Fix this

// Credentials Loading
import { clientId, clientSecret } from './credentials.js';

const tokensFile = './tokens.json';
const fileEncoding = 'UTF-8';

const trackedChannels = [
    // 'pudgyycat',
    // 'kingmcewan',
    'cajogos',
    // 'yeekaycrafts',
    // 'lifeofbeard',
    // 'motleyverse',
    // 'mrricardo94',
    // 'karrantula',
    // 'chef_brandon',
    // 'AameeLark'
];

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
            const food = await randomFood();
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
            let joke = getJoke(text.split(' ')[1]);

            let message = `@${username} ${joke.setup} ${joke.punchline}`;
            chatClient.say(channel, message);
        }

        // Get pokedex entry
        if (text.startsWith('!pokedex'))
        {
            let parts = text.split(' ');

            let response = getPokedexEntry(parts[1]);

            let message = `@${username} ${response}`;
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
