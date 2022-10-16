// NOOT NOOT!

/**
 * @param {string} text
 * @returns {boolean}
 */
function shouldNoot(text)
{
    let shouldNoot = false;

    text = text.toLowerCase();
    let nootKeywords = [
        'nootnoot',
        'noot noot',
        'noothype'
    ];

    for (let i = 0; i < nootKeywords.length; i++)
    {
        if (text.includes(nootKeywords[i]))
        {
            shouldNoot = true;
            break;
        }
    }

    return shouldNoot;
}

export { shouldNoot };