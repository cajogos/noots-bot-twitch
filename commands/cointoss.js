export default function cointoss()
{
    let random = Math.floor(Math.random() * 10);
    if (random % 2)
    {
        return 'HEADS';
    }
    return 'TAILS';
}