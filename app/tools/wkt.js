import WKT from 'ol/format/WKT';
import Feature from 'ol/Feature';
import {defaultProjOptions} from './projection';

export const wktReader = new WKT();

export const WKT_TYPE = [
    'POINT',
    'LINESTRING',
    'POLYGON',
    'MULTIPOINT',
    'MULTILINESTRING',
    'MULTIPOLYGON',
    'GEOMETRYCOLLECTION',
];

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
 * @returns {Feature}
 */
export function wkt2Feature(wkt, options) {
    const geom = wkt2Geometry(wkt, options);

    return new Feature(geom);
}

/**
 * ol/geom to wkt
 * @param {import('ol/geom').Geometry} geom 
 * @param {import('./projection').ProjOptions} options
 * @returns {string}
 */
export function geometry2Wkt(geom, options = defaultProjOptions) {
    return wktReader.writeGeometry(geom, options);
}

/**
 * ol/Feature to wkt
 * @param {import('ol/Feature').default} feature
 * @param {import('./projection').ProjOptions} options
 * @returns {string}
 */
export function feature2Wkt(feature, options) {
    const geometry = feature.getGeometry();
    return geometry2Wkt(geometry, options);
}