import { RefreshingAuthProvider } from '@twurple/auth';
import { ChatClient } from '@twurple/chat';
import { ApiClient, ChattersList } from '@twurple/api';
import { promises as fs } from 'fs';
import fetch from 'node-fetch';

import { clientId, clientSecret } from './credentials.js';

const tokensFile = './tokens.json';
const fileEncoding = 'UTF-8';
const trackedChannels = [
    'pudgyycat',
    'kingmcewan',
    'cajogos',
    'yeekaycrafts',
    'lifeofbeard',
    'mrricardo94',
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

        // if (vipUsers.includes(username))
        // {
        //     chatClient.say(channel, '!so ' + username);
        // }

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

        if (text.startsWith('!pokecatch'))
        {
            chatClient.say(channel,
                `Good luck with the catch @${username}! PowerUpL GlitchCat PowerUpR`
            );
        }

        if (text.startsWith('!cajogos'))
        {
            chatClient.say(channel, `Find out more: https://cajogos.stream`);
        }

        // const user = await apiClient.users.getUserByName(username);

        // console.log('*** FOLLOWS ***');
        // let follows = await apiClient.users.getFollows({ user: user.id });
        // console.log(`${username} follows ${follows.total} channels`);
        // for (const follow of follows.data)
        // {
        //     console.log(follow.followedUserId, follow.followedUserDisplayName, follow.followedUserName, follow.followDate.toLocaleDateString());
        // }

        // console.log('*** FOLLOWERS ***');
        // let followers = await apiClient.users.getFollows({ followedUser: user.id });
        // console.log(`${username} has ${followers.total} followers`);
        // for (const follower of followers.data)
        // {
        //     console.log(follower.userId, follower.userDisplayName, follower.userName);
        // }

        // let channelUser = await apiClient.users.getUserByName(channel.replace('#', ''));
        // let channelObject = await apiClient.channels.getChannelInfoById(channelUser.id);
        // console.log(`${channelObject.displayName} is playing ${channelObject.gameName}.`);

        // let chatters = await apiClient.unsupported.getChatters(channelObject.name);
        // for (const chatter of chatters.allChattersWithStatus)
        // {
        //     console.log(chatter);
        // }
    });



    await chatClient.connect();
}

main();