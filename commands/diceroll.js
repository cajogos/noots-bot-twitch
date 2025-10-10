/**
 * @param {string} commandText - The full command text to parse for dice type
 * @returns {string}
 */
function diceroll(commandText = "")
{
    // Parse the command text to check for d20
    const parts = commandText.split(' ');
    const hasD20 = parts.some(part =>
        part.toLowerCase().includes("d20") ||
        part.toLowerCase().includes("20")
    );

    // Check if user wants a d20 roll
    if (hasD20)
    {
        const roll = Math.floor(Math.random() * 20) + 1;
        return `🎲 D20: ${roll}`;
    }

    // Default to d6 roll
    const roll = Math.floor(Math.random() * 6) + 1;
    return `🎲 D6: ${roll}`;
}

export { diceroll };