/**
 * check string is json
 * @param {string} str 
 */
export function isJSONString(str) {
    try {
        return JSON.parse(str) && true;
    } catch (error) {
        return false;
    }
}

