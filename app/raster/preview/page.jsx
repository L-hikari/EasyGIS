'use client';
import React, {useEffect, useRef, useState} from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {cloneDeep as _cloneDeep} from 'lodash-es';
import { Collection } from 'ol';
import TileWMS from "ol/source/TileWMS";
import WMTS from "ol/source/WMTS";
import WMTSTileGrid from "ol/tilegrid/WMTS";
import XYZ from "ol/source/XYZ";
import Modal from '../../components/Modal';

const SUPPORT_TYPE = ['WMS', 'WMTS', 'TMS'];
const WMSParams = {
    LAYERS: 'default is LayerName',
    VERSION: 'default is 1.3.0',
};
const WMTSParams = {
    layer: 'default is LayerName',
    matrixSet: '',
    matrixId: 'default is {z}, you can custom defined like EPSG:3857:{z}'
}
export default function VectorPreview() {
    /** @type {{current: import('ol/Map').default}} */
    const mapRef = useRef();
    const mapContainer = useRef();
    const layerCollection = useRef(
        new Collection([
            new TileLayer({
                source: new OSM(),
            })
        ])
    );

    const [layers, setLayers] = useState([
        {id: 'osm', name: 'openstreetmap', type: 'TMS', checked: true}
    ]);
    const [addVisible, setAddVisible] = useState(false);
    const [layerName, setLayerName] = useState('');
    const [layerType, setLayerType] = useState('WMS');
    const [layerUrl, setLayerUrl] = useState('');
    const [layerParams, setLayerParams] = useState('{}');

    useEffect(initMap, []);

    function initMap() {
        mapRef.current = new Map({
            target: mapContainer.current,
            view: new View({
                center: [0, 0],
                zoom: 3,
            }),
            layers: layerCollection.current
        });
    }

    function onCheckboxChange(event, index) {
        const newItems = _cloneDeep(layers);
        newItems[index].checked = event.target.checked;

        changeLayerVisible(index, event.target.checked);
        setLayers(newItems);
    };

    function onDragStart(event, index) {
        event.dataTransfer.setData('text/plain', index);
    };

    function onDragOver(event) {
        event.preventDefault();
    };

    function onDrop(event, index) {
        const draggedIndex = event.dataTransfer.getData('text/plain');
        const draggedItem = layers[draggedIndex];
        const newItems = _cloneDeep(layers);
        
        changeLayerOrder(index, draggedIndex);
        newItems.splice(draggedIndex, 1);
        newItems.splice(index, 0, draggedItem);
        setLayers(newItems);
    };

    function changeLayerOrder(index, draggedIndex) {
        const layer1 = layerCollection.current.item(index);
        const layer2 = layerCollection.current.item(draggedIndex);

        layerCollection.current.setAt(draggedIndex, layer1);
        layerCollection.current.setAt(index, layer2);
    }

    function changeLayerVisible(index, visible) {
        const layer = layerCollection.current.item(index);

        layer.setVisible(visible);
    }

    function onAddLayer() {
        console.log(layerName, layerType, layerParams);
        let layer;
        if (layerType === 'WMS') {
            layer = new TileLayer({
                source: new TileWMS({
                    url: layerUrl,
                    params: {
                        LAYERS: layerName,
                        ...JSON.parse(layerParams)
                    }
                })
            });
        }
        else if (layerType === 'WMTS') {
            const baseResolution = 156543.03392804097;
            const resolutions = new Array(21);
            const matrixIds = new Array(21);
            for (let z = 0; z < 21; ++z) {
                // generate resolutions and matrixIds arrays for this WMTS
                resolutions[z] = baseResolution * Math.pow(2, 0 - z);
                matrixIds[z] = layerParams.matrixId ? layerParams.matrixId.replace('{z}', z) : z;
            }

            layer = new TileLayer({
                source: new WMTS({
                    url: layerUrl,
                    layer: layerName,
                    matrixSet: layerParams.matrixSet,
                    projection: 'EPSG:3857',
                    format: 'image/png',
                    tileGrid: new WMTSTileGrid({
                        origin: [-2.003750834e7, 2.003750834e7],
                        resolutions,
                        matrixIds
                    }),
                    ...JSON.parse(layerParams)
                })
            });
        }
        else if (layerType === 'TMS') {
            layer = new TileLayer({
                source: new XYZ({
                    url: layerUrl
                })
            });
        }
        else {
            console.error('unsupport layer type');
            return;
        }

        layerCollection.current.push(layer);

        const arr = _cloneDeep(layers);
        arr.push({
            name: layerName,
            type: layerType,
            checked: true,
            id: Date.now()
        });
        setLayers(arr);
        setAddVisible(false);
    }

    return (
        <div className="h-full flex">
            <Modal title="Add Layer" visible={addVisible} onClose={() => setAddVisible(false)} onOk={onAddLayer}>
                <div className="mb-2">
                    <label htmlFor="" className="inline-block w-28">Layer name: </label>
                    <input
                        type="text"
                        className="border border-gray-300"
                        onChange={e => setLayerName(e.target.value)}
                    />
                </div>
                <div className="mb-2">
                    <label htmlFor="" className="inline-block w-28">Type: </label>
                    <select
                        className="border border-gray-300 px-2 py-1 mr-2"
                        onChange={e => setLayerType(e.target.value)}
                    >
                        {SUPPORT_TYPE.map(type => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-2">
                    <label htmlFor="" className="inline-block w-28">Url: </label>
                    <input
                        type="text"
                        className="border border-gray-300"
                        onChange={e => setLayerUrl(e.target.value)}
                    />
                </div>
                {layerType !== 'TMS' && (
                    <div>
                        <label htmlFor="" className="inline-block w-28">Params: </label>
                        <textarea
                            type="text"
                            rows="5"
                            cols="30"
                            className="border border-gray-300"
                            onChange={e => setLayerParams(e.target.value)}
                            placeholder={layerType === 'WMS' ? JSON.stringify(WMSParams) : JSON.stringify(WMTSParams)}
                        />
                    </div>
                )}
            </Modal>
            <div className="h-full bg-white shadow rounded w-1/4 py-3">
                <p className="border-b border-gray-300 pl-3">
                    Layer list you can drag the order and check the visible
                </p>
                <ul className="pl-6 space-y-2">
                    {layers.map((item, index) => (
                        <li
                            key={item.id}
                            className="flex items-center"
                            draggable
                            onDragStart={event => onDragStart(event, index)}
                            onDragOver={onDragOver}
                            onDrop={event => onDrop(event, index)}
                        >
                            <input
                                type="checkbox"
                                className="mr-2"
                                checked={item.checked}
                                onChange={event => onCheckboxChange(event, index)}
                            />
                            <span className="text-gray-800">{item.name}({item.type})</span>
                        </li>
                    ))}
                </ul>
                <button onClick={() => setAddVisible(true)}>Add Layer</button>
            </div>
            <div className="h-full flex-1" ref={mapContainer}></div>
        </div>
    );
}

/**
 * @typedef LayerDes
 * @property {string} name
 * @property {'WMS' | 'WMTS' | 'TMS'} type
 * @property {boolean} checked
 */