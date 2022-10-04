import { RefreshingAuthProvider } from '@twurple/auth';
import { ChatClient } from '@twurple/chat';
import { clientId, clientSecret } from './credentials.js';

import { promises as fs } from 'fs';

const tokensFile = './tokens.json';
const fileEncoding = 'UTF-8';
const trackedChannels = [
    'pudgyycat',
    'kingmcewan',
    'cajogos',
    'yeekaycrafts',
    'lifeofbeard'
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

    chatClient.onMessage((channel, user, text) =>
    {
        console.log(`[${channel}] ${user}: ${text}`);

        if (text === 'nootnoot')
        {
            chatClient.say(channel, 'NOOT NOOT!');
        }
    });

    await chatClient.connect();
}

main();