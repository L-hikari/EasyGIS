'use client';
import React, {useEffect, useRef, useState} from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import c from 'classnames';
import {SUPPORT_FORMAT, isJSONString} from '../../tools';
import {wkt2Feature} from '../../tools/wkt';
import { SUPPORT_PROJ } from '../../tools/projection';
import { geojson2Feature, geojson2Geometry } from '../../tools/geojson';
import { Feature } from 'ol';
import { transform } from 'ol/proj';
import { Point } from 'ol/geom';

export default function VectorPreview() {
    /** @type {{current: import('ol/Map').default}} */
    const mapRef = useRef();
    const mapContainer = useRef();
    const vectorSource = useRef(new VectorSource());
    const vectorLayer = useRef(
        new VectorLayer({
            source: vectorSource.current,
        })
    );

    const [textError, setTextError] = useState(false);
    const [coordFormat, setCoordFormat] = useState(SUPPORT_FORMAT[0]);
    const [coordSystem, setCoordSystem] = useState(SUPPORT_PROJ[0]);
    const [inputText, setInputText] = useState('');

    useEffect(initMap, []);

    useEffect(setFeature, [coordFormat, coordSystem, inputText]);

    function initMap() {
        mapRef.current = new Map({
            target: mapContainer.current,
            view: new View({
                center: [0, 0],
                zoom: 3,
            }),
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
                vectorLayer.current,
            ],
        });
    }

    function onCoordFormatChange(e) {
        setCoordFormat(e.target.value);
    }

    function onCoordSystemChange(e) {
        setCoordSystem(e.target.value);
    }

    function onTextChange(e) {
        setInputText(e.target.value);
    }

    function setFeature(e) {

        try {

            if (!inputText) {
                return;
            }
            setTextError(false);

            /** @type {import('ol/Feature').default} */
            let feature;

            /** @type {import('../../../tools/projection').ProjOptions} */
            const projOptions = {
                dataProjection: coordSystem,
                featureProjection: 'EPSG:3857'
            };

            const view = mapRef.current.getView();

            if (coordFormat === 'x,y,x,y') {
                vectorSource.current.addFeatures(xy2Features(inputText));

                view.fit(vectorSource.current.getExtent(), {
                    padding: [30, 30, 30, 30]
                });
                return;
            }
            else if (coordFormat === 'GeoJSON') {
                /** @type {import('ol/format/GeoJSON').GeoJSONGeometry} */
                const json = JSON.parse(inputText);

                if (json.type === 'Feature') {
                    feature = geojson2Feature(json, projOptions);
                }
                else {
                    feature = new Feature(geojson2Geometry(json, projOptions));
                }

            }
            else if (coordFormat === 'WKT') {
                feature = wkt2Feature(inputText);
            }

            vectorSource.current.addFeature(feature);
        } catch (error) {
            console.log(error);
            setTextError(true);
        }
    }

    /**
     * x,y to features
     * @param {string} str
     */
    function xy2Features(str) {
        const source = str.split(',');
        const features = [];

        for (let i = 0; i < source.length; i += 2) {
            const coordinate = transform([source[i], source[i + 1]], coordSystem, 'EPSG:3857');

            const f = new Feature(new Point(coordinate));

            features.push(f);
        }

        return features;
    }

    return (
        <div className="h-full flex">
            <div className="h-full bg-white shadow rounded p-3">
                <div className="flex mb-2">
                    <select
                        className="border border-gray-300 px-2 py-1 mr-2"
                        value={coordSystem}
                        onChange={onCoordSystemChange}
                    >
                        {SUPPORT_PROJ.map(proj => (
                            <option key={proj} value={proj}>
                                {proj}
                            </option>
                        ))}
                    </select>
                    <select
                        className="border border-gray-300 px-2 py-1"
                        value={coordFormat}
                        onChange={onCoordFormatChange}
                    >
                        {SUPPORT_FORMAT.map(proj => (
                            <option key={proj} value={proj}>
                                {proj}
                            </option>
                        ))}
                    </select>
                </div>
                <textarea
                    className={c('p-2 text-gray-800 resize-none outline-0 border border-gray-300', {
                        'border-orange-600': textError,
                    })}
                    rows="4"
                    cols="30"
                    placeholder="input coordinate"
                    value={inputText}
                    onChange={onTextChange}
                ></textarea>
            </div>
            <div className="h-full flex-1" ref={mapContainer}></div>
        </div>
    );
}
