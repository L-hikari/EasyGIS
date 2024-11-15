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

/**
 * @enum {'WKT' | 'GeoJSON' | 'x,y,x,y'}
 */
export const SUPPORT_FORMAT = ['WKT', 'GeoJSON', 'x,y,x,y'];