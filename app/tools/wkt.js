import WKT from 'ol/format/WKT';
import Feature from 'ol/Feature';
import { defaultProjOptions } from './projection';

export const wktReader = new WKT();

/**
 * wkt to ol/geom
 * @param {string} wkt 
 * @param {import('./projection').ProjOptions} options
 * @returns {import('ol/geom').Geometry}
 */
export function wkt2Geometry(wkt, options = defaultProjOptions) {
    return wktReader.readGeometry(wkt, options);
}

/**
 * wkt to ol/Feature
 * @param {string} wkt 
 * @param {import('./projection').ProjOptions} options 
 * @returns 
 */
export function wkt2Feature(wkt, options) {
    const geom = wkt2Geometry(wkt, options);

    return new Feature(geom);
}