'use client';
import React, { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import Draw from "ol/interaction/Draw";
import { geometry2Wkt } from '../../tools/wkt';

const geometryType = ['Point', 'LineString', 'Polygon', 'Circle'];
export default function DrawAndModify(props) {
    /** @type {{current: import('ol/Map').default}} */
    const mapRef = useRef();
    const mapContainer = useRef();
    const vectorSource = useRef(new VectorSource());
    const vectorLayer = useRef(
        new VectorLayer({
            source: vectorSource.current,
        })
    );
    const drawRef = useRef(
        new Draw({
            type: 'Point',
            source: vectorSource.current
        })
    );

    const [wkt, setWkt] = useState('');

    useEffect(initMap, []);

    useEffect(() => {
        onGeometryTypeChange({target: {value: 'Point'}});
    }, []);

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
            ]
        });
    }

    function onGeometryTypeChange(e) {
        vectorSource.current.clear();

        mapRef.current.removeInteraction(drawRef.current);

        drawRef.current = new Draw({
            type: e.target.value,
            source: vectorSource.current
        });

        drawRef.current.on('drawstart', onDrawStart);
        drawRef.current.on('drawend', onDrawEnd);
        mapRef.current.addInteraction(drawRef.current);
    }

    /**
     * Draw end
     * @param {import('ol/interaction/Draw').DrawEvent} e 
     */
    function onDrawEnd(e) {
        const geom = e.feature.getGeometry();

        const wkt = geometry2Wkt(geom);
        setWkt(wkt);
    }

    /**
     * Draw start
     * @param {import('ol/interaction/Draw').DrawEvent} e 
     */
    function onDrawStart(e) {
        vectorSource.current.clear();
    }

    return (
        <div className="h-full flex">
            <div className="h-full bg-white shadow rounded p-3">
                <div className="flex mb-2">
                    <label className="block mr-2">Geometry type:</label>
                    <select
                        className="border border-gray-300 px-2 py-1 mr-2"
                        onChange={onGeometryTypeChange}
                    >
                        {geometryType.map(type => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
                <textarea
                    value={wkt}
                    disabled
                    className="w-96 h-40 bg-gray-200 p-2 cursor-not-allowed"
                ></textarea>
            </div>
            <div className="h-full flex-1" ref={mapContainer}></div>
        </div>
    );
}
