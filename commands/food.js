import fetch from 'node-fetch';

// Get a list of random foods
async function randomFood()
{
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const data = await response.json();
    return data.meals[0];
}

export { randomFood };