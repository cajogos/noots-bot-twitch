const doGibeaway = (users) =>
{
    return users[Math.floor(Math.random() * users.length)];
};

export { doGibeaway };