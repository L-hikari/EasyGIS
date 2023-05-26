'use client';
import React, {useEffect, useRef} from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

export default function VectorPreview() {
    const mapRef = useRef();

    const mapContainer = useRef();

    // useEffect(initMap, []);

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
            ],
        });
    }

    return (
        <div className="relative" style={{height: 'calc(100% - 40px)'}}>
            <div className="h-full" ref={mapContainer}></div>
            <textarea
                className="absolute top-4 left-4 bg-gray-200 p-2 text-gray-800 resize-none outline-0 border-0 shadow-md rounded"
                rows="4"
                cols="40"
                placeholder="input WKT or GeoJSON"
            ></textarea>
        </div>
    );
}
