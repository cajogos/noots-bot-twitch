async function getPokedexEntry(id)
{
    let chatResponse = "Looking for pokemon";
    const idSanitize = id.toLowerCase();
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${idSanitize}`);

    if (!response.ok)
    {
        chatResponse = "Cannot find pokemon!";
    }
    else
    {
        const data = await response.json();
        chatResponse = "#" + data.id + " - " + data.name;
    }
    return chatResponse;
}

export { getPokedexEntry };
