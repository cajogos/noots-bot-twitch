import { RefreshingAuthProvider } from '@twurple/auth';
import { ChatClient } from '@twurple/chat';
import { ApiClient } from '@twurple/api';
import { promises as fs } from 'fs';

// Commands
import { randomFact } from './commands/facts.js';
import { getJoke } from './commands/jokes.js';
import { randomFood } from './commands/food.js';
import { shouldNoot } from './commands/nootnoot.js';
import { getPokedexEntry } from './commands/pokedex.js';

// Credentials
import { clientId, clientSecret } from './credentials.js';
// Configuration
import { trackedChannels } from './config.js';

const tokensFile = './tokens.json';
const fileEncoding = 'UTF-8';

async function main()
{
    // Set-up the auth provider
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

    // Chat Client
    const chatClient = new ChatClient({
        authProvider,
        channels: trackedChannels
    });

    // API Client
    const apiClient = new ApiClient({ authProvider });

    // When a raid to the channel happens
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

    // Handle receiving a message in chat
    chatClient.onMessage(async (channel, username, text) =>
    {
        console.log(`[${channel}] ${username}: ${text}`);

        // Noot Noot!
        if (shouldNoot(text))
        {
            chatClient.say(channel, 'cajogoNootHYPE cajogoNootHYPE cajogoNootHYPE');
        }

        // Noot HYPE!
        if (text.startsWith('!noothype'))
        {
            let hypeText = 'cajogoEyes cajogoEyess cajogoNootHYPE cajogoEyes cajogoEyess cajogoNootHYPE cajogoEyes cajogoSZap cajogoNootHYPE cajogoEyess cajogoEyes cajogoLugia cajogoAstro cajogoBonk cajogoHYPE cajogoSZap cajogoNootNoot cajogoHYPE cajogoSZap cajogoLugia cajogoAstro cajogoEyes cajogoEyess cajogoNootHYPE cajogoBonk cajogoSZap cajogoHYPE cajogoNootNoot';
            chatClient.say(channel, hypeText);
        }

        // Yeeks what's for tea!
        if (text.includes('yeekayTea') || text.includes('yeekayWhatfortea'))
        {
            const food = await randomFood();
            chatClient.say(channel, `@${username} how about ${food.strMeal}? Kappa`);
        }

        // I have no money song
        if (text.startsWith('!nomoney'))
        {
            chatClient.say(channel, 'I have no money SingsNote I have no money SingsNote I have no money SingsNote I have no money SingsNote');
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

        // Good luck pokecatch!
        if (text.startsWith('!pokecatch'))
        {
            chatClient.say(channel,
                `Good luck with the catch @${username}! PowerUpL GlitchCat PowerUpR`
            );
        }

        // Bonk command
        if (text.startsWith('!bonk'))
        {
            let bonkedUser = text.split(' ')[1];
            if (bonkedUser)
            {
                bonkedUser = bonkedUser.replace('@', '');
                if (bonkedUser === 'cajogos')
                {
                    chatClient.say(channel, `@${username} I can't bonk the creator!`);
                }
                else
                {
                    chatClient.say(channel, `@${bonkedUser} BOP cajogoBonk`);
                }
            }
            else
            {
                chatClient.say(channel, `@${username} Who do you want to bonk?`);
            }
        }

        // Stare command
        if (text.startsWith('!stare'))
        {
            let staredUser = text.split(' ')[1];
            if (staredUser)
            {
                staredUser = staredUser.replace('@', '');
                chatClient.say(channel, `@${staredUser} cajogoEyes cajogoEyes`);
            }
            else
            {
                chatClient.say(channel, `cajogoEyes cajogoEyes cajogoEyes`);
            }
        }

        // Shameless cajogos promo
        if (text.startsWith('!cajogos'))
        {
            chatClient.say(channel, `I was made by @cajogos! Find out more: https://cajogos.stream`);
        }

        // Get pokedex entry
        if (text.startsWith('!pdex'))
        {
            let parts = text.split(' ');
            if (parts.length === 2)
            {
                let response = await getPokedexEntry(parts[1]);
                let message = `@${username} ${response}`;
                chatClient.say(channel, message);
            }
        }
    });

    await chatClient.connect();
}

main();
