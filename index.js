import { RefreshingAuthProvider } from '@twurple/auth';
import { ChatClient } from '@twurple/chat';
import { ApiClient } from '@twurple/api';
import { promises as fs } from 'fs';

import ActiveChatManager from './classes/ActiveChatManager.js';

// Commands
import { randomFact } from './commands/facts.js';
import { getJoke } from './commands/jokes.js';
import { randomFood } from './commands/food.js';
import { shouldNoot } from './commands/nootnoot.js';
import { getPokedexEntry } from './commands/pokedex.js';
import cointoss from './commands/cointoss.js';
import { gibeResponse, hazResponse } from './commands/basic-responder.js';

// Credentials
import { clientId, clientSecret } from './credentials.js';
// Configuration
import { trackedChannels, botName } from './config.js';
import { doGibeaway } from './commands/gibeaway.js';

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

    const isWordOrContains = (text, word) =>
    {
        text = text.toLowerCase();
        word = word.toLowerCase();

        if (text === word) return true;

        return text.includes(` ${word} `) || text.startsWith(`${word} `) || text.endsWith(` ${word}`);
    };

    // API Client
    const apiClient = new ApiClient({ authProvider });

    // Active chatters
    const chatActive = new ActiveChatManager();

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

        // Ignore itself - if there are multiple bots
        if (username.toLocaleLowerCase() === botName.toLocaleLowerCase())
        {
            return;
        }

        const channelOwner = channel.split('#')[1];
        const isChannelOwner = username === channelOwner;

        // Add user to active chat list
        chatActive.addUserToChannel(channel, username);
        const activeChatters = chatActive.getActiveUsersInChannel(channel);

        // Gibeaway command
        if (isChannelOwner && text === '!gibeaway' && activeChatters.length > 0)
        {
            const winner = doGibeaway(activeChatters);
            chatClient.say(channel, `The winner is @${winner}!`);
        }

        // Starts with a response
        if (hazResponse(text))
        {
            chatClient.say(channel, gibeResponse(text));
        }

        // Noot Noot!
        if (shouldNoot(text))
        {
            chatClient.say(channel, 'cajogoNootHYPE cajogoNootHYPE cajogoNootHYPE');
        }

        // Manifest command
        if (text.startsWith('!manifest'))
        {
            const manifest = text.split('!manifest')[1].trim();
            chatClient.say(channel, `✨ ${manifest} ✨`);
        }

        // Good bot / bad bot
        if (isWordOrContains(text, 'good bot'))
        {
            chatClient.say(channel, `Thank you @${username}! cajogoNootHYPE`);
        }
        else if (isWordOrContains(text, 'bad bot'))
        {
            chatClient.say(channel, `u wut m8 @${username} cajogoEyes`);
        }

        // Sees booba in chat
        if (isWordOrContains(text, 'booba'))
        {
            chatClient.say(channel, `GivePLZ Booba TakeNRG`);
        }

        // Sees butt in chat
        if (isWordOrContains(text, 'butt'))
        {
            chatClient.say(channel, `GivePLZ Butt TakeNRG`);
        }

        // LUL multiplier
        if (text.includes('LUL'))
        {
            const lulCount = text.split('LUL').length - 1;
            chatClient.say(channel, `LUL ${'LUL '.repeat(lulCount)}`);
        }

        // Yeeks what's for tea!
        if (text.includes('yeekayTea') || text.includes('yeekayWhatfortea') || text === "What's for tea?")
        {
            const food = await randomFood();
            chatClient.say(channel, `@${username} how about ${food.strMeal}? Kappa`);
        }

        // Random fact
        if (text === '!fact')
        {
            chatClient.say(channel, `@${username} Here is a random fact: ` + randomFact());
        }

        if (text.startsWith('!cointoss'))
        {
            chatClient.say(channel, ` @${username} tossed a coin! And the result is... ${cointoss()} cajogoEyes`);
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
            chatClient.say(channel, `Good luck with the catch @${username}! PowerUpL GlitchCat PowerUpR`);
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

        // Hug command
        if (text.startsWith('!hug'))
        {
            let huggedUser = text.split(' ')[1];
            if (huggedUser)
            {
                huggedUser = huggedUser.replace('@', '');
                chatClient.say(channel, `@${username} is hugging @${huggedUser} <3 <3 <3`);
            }
            else
            {
                chatClient.say(channel, `@${username} Who do you want to hug?`);
            }
        }

        // Punch command
        if (text.startsWith('!punch'))
        {
            let punchedUser = text.split(' ')[1];
            if (punchedUser)
            {
                punchedUser = punchedUser.replace('@', '');
                if (punchedUser === 'cajogos')
                {
                    chatClient.say(channel, `@${username} I can't punch the creator!`);
                }
                else
                {
                    chatClient.say(channel, `@${username} is punching @${punchedUser} cajogoEyes`);
                }
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
