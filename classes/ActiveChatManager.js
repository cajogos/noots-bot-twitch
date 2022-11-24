export default class ActiveChatManager
{
    constructor()
    {
        this.channels = [];
    }

    addUserToChannel(channel, user)
    {
        // does channel exist in chat
        if (!this.channels[channel])
        {
            this.channels[channel] = [];
        }

        this.channels[channel].push(user);
    }

    getUsersInChannel(channel)
    {
        return this.channels[channel];
    }
}