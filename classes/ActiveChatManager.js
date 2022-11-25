export default class ActiveChatManager
{
    constructor()
    {
        this.TIME_FOR_ACTIVE = 1000 * 60 * 20; // 20 minutes
        this.channels = [];
    }

    addUserToChannel(channel, user)
    {
        // does channel exist in chat
        if (!this.channels[channel])
        {
            this.channels[channel] = [];
        }

        this.channels[channel][user] = Date.now();
    }

    getActiveUsersInChannel(channel)
    {
        let now = Date.now();
        let actuallyActive = [];

        for (let user in this.channels[channel])
        {
            if ((now - this.channels[channel][user]) < this.TIME_FOR_ACTIVE)
            {
                actuallyActive.push(user);
            }
        }

        return actuallyActive;
    }
}