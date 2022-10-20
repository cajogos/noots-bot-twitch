import fs from 'fs';

const responses = loadResponses();

/**
 * @returns {string[]}
 */
function loadResponses()
{
    return JSON.parse(fs.readFileSync('./data/basic-responses.json'));
}

/**
 * @param {string} command
 * @returns {string}
 */
 function gibeResponse(command)
 { 
    command = sanitizeCommand(command)
    if(hazResponse(command)){
        return responses[command]
    }
    return null
 }
/**
 * @param {string} command
 * @returns {string}
 */
 function sanitizeCommand(command){
    return command.toLowerCase().trim().split(" ")[0]
 }

 /**
 * @param {string} command
 * @returns {boolean}
 */
 function hazResponse(command){
    command = sanitizeCommand(command)
    return (typeof responses[command] !== "undefined")
 }
 
 export { gibeResponse, hazResponse };