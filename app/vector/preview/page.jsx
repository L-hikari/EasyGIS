'use client';
import React, {useEffect, useRef, useState} from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import c from 'classnames';
import { isJSONString } from '../../tools';
import { wkt2Feature } from '../../tools/wkt';

export default function VectorPreview() {
    const mapRef = useRef();

    const mapContainer = useRef();

    const vectorSource = useRef(
        new VectorSource()
    );

    const vectorLayer = useRef(
        new VectorLayer({
            source: vectorSource.current
        })
    );

    const [textError, setTextError] = useState(false);

    useEffect(initMap, []);

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
                vectorLayer.current
            ],
        });
    }

    function onTextChange(e) {
        const text = e.target.value;

        if (!text) {
            vectorSource.current.clear();
            setTextError(false);
            return;
        }
        
        try {
            /** @type {import('ol/Feature').default} */
            let feature;

            if (isJSONString(text)) {
                
            } else {
                feature = wkt2Feature(text);
            }

            vectorSource.current.addFeature(feature);

        } catch (error) {
            // console.log(error);
            setTextError(true);
        }
    }

    return (
        <div className="relative" style={{height: 'calc(100% - 40px)'}}>
            <div className="h-full" ref={mapContainer}></div>
            <textarea
                className={
                    c('absolute top-4 left-4 bg-gray-200 p-2 text-gray-800 resize-none outline-0 border shadow-md rounded', {
                        'border-orange-600': textError
                    })
                }
                rows="4"
                cols="40"
                placeholder="input WKT or GeoJSON (EPSG:4326)"
                onChange={onTextChange}
            ></textarea>
        </div>
    );
}
