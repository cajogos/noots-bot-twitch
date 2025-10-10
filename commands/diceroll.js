/**
 * @param {string} diceType - Optional parameter for dice type ("d20" for 20-sided, anything else for 6-sided)
 * @returns {string}
 */
export default function diceroll(diceType = "")
{
    // Check if user wants a d20 roll
    if (diceType.toLowerCase().includes("d20") || diceType.toLowerCase().includes("20"))
    {
        const roll = Math.floor(Math.random() * 20) + 1;
        return `🎲 D20: ${roll}`;
    }

    // Default to d6 roll
    const roll = Math.floor(Math.random() * 6) + 1;
    return `🎲 D6: ${roll}`;
}
