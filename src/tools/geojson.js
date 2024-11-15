import GeoJSON from "ol/format/GeoJSON";
import { defaultProjOptions } from "./projection";

export const geojsonReader = new GeoJSON();

/**
 * geojson to ol/geom
 * @param {import('ol/format/GeoJSON').GeoJSONGeometry} geojson
 * @param {import('./projection').ProjOptions} options
 * @returns {import('ol/geom').Geometry}
 */
export function geojson2Geometry(geojson, options = defaultProjOptions) {
    return geojsonReader.readGeometry(geojson, options);
}

/**
 * geojson to ol/Feature
 * @param {string} geojson
 * @param {import('./projection').ProjOptions} options
 * @returns {import('ol/Feature').default}
 */
export function geojson2Feature(geojson, options = defaultProjOptions) {
    return geojsonReader.readFeature(geojson, options);
}

/**
 * ol/geom to geojson
 * @param {import('ol/geom').Geometry} geom 
 * @param {import('./projection').ProjOptions} options
 * @returns {import('ol/format/GeoJSON').GeoJSONGeometry}
 */
export function geometry2Geojson(geom, options = defaultProjOptions) {
    return geojsonReader.writeGeometryObject(geom, options);
}

/**
 * ol/Feature to geojson
 * @param {import('ol/Feature').default} feature
 * @param {import('./projection').ProjOptions} options
 * @returns {import('ol/format/GeoJSON').GeoJSONGeometry}
 */
export function feature2Geojson(feature, options = defaultProjOptions) {
    return geojsonReader.writeFeatureObject(feature, options);
}