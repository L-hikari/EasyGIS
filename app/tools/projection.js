
/**
 * @typedef ProjOptions
 * @property {import('ol/proj/Projection').default | string} dataProjection
 * @property {import('ol/proj/Projection').default | string} featureProjection
 */

/** @type {ProjOptions} */
const defaultProjOptions = {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857'
};

export {
    defaultProjOptions,
}