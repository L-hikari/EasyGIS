
/**
 * @typedef ProjOptions
 * @property {import('ol/proj/Projection').default | string} dataProjection
 * @property {import('ol/proj/Projection').default | string} featureProjection
 */

/** @type {ProjOptions} */
export const defaultProjOptions = {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857'
};

export const SUPPORT_PROJ = [
    'EPSG:4326',
    'EPSG:3857'
];