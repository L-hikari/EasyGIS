'use client';
import React, {useEffect, useRef, useState} from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {cloneDeep as _cloneDeep} from 'lodash-es';
import {Collection} from 'ol';
import TileWMS from 'ol/source/TileWMS';
import WMTS from 'ol/source/WMTS';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import XYZ from 'ol/source/XYZ';
import Modal from '../../components/Modal';
import {EditorView, basicSetup} from 'codemirror';
import {javascript} from '@codemirror/lang-javascript';
import {EditorState} from '@codemirror/state';
import deleteSvg from "../../images/delete.svg";
import Image from 'next/image';
import c from 'classnames';

const SUPPORT_TYPE = ['WMS', 'WMTS', 'TMS'];
const WMSCode = `
    // Openlayers will use the return TileLayer!!!
    (function() {
        // more option in
        // https://openlayers.org/en/latest/apidoc/module-ol_source_TileWMS-TileWMS.html
        return new TileLayer({
            source: new TileWMS({
                url: '',
                params: {
                    LAYERS: '',
                    // default version 1.3.0
                    VERSION: '1.3.0'
                },
            }),
        });
    })()
`;
const WMTSCode = `
    // Openlayers will use the return TileLayer!!!
    (function() {
        const baseResolution = 156543.03392804097;
        const resolutions = new Array(21);
        const matrixIds = new Array(21);
        for (let z = 0; z < 21; ++z) {
            // generate resolutions and matrixIds arrays for this WMTS
            resolutions[z] = baseResolution / Math.pow(2, z);
            // TileMatrix default is z
            // you can custom defined like \`'EPSG:3857' + ':' + z\`
            matrixIds[z] = z;
        }
        // more option in
        // https://openlayers.org/en/latest/apidoc/module-ol_source_WMTS-WMTS.html
        return new TileLayer({
            source: new WMTS({
                url: '',
                layer: '',
                matrixSet: '',
                // default projection is EPSG:3857
                projection: 'EPSG:3857',
                format: 'image/png',
                tileGrid: new WMTSTileGrid({
                    origin: [-2.003750834e7, 2.003750834e7],
                    resolutions,
                    matrixIds,
                }),
            }),
        });
    })()
`;
const TMSCode = `
    // Openlayers will use the return TileLayer!!!
    (function() {
        // more option in
        // https://openlayers.org/en/latest/apidoc/module-ol_source_XYZ-XYZ.html
        return new TileLayer({
            source: new XYZ({
                url: '',
            }),
        });
    })()
`;
export default function RasterPreview() {
    /** @type {{current: import('ol/Map').default}} */
    const mapRef = useRef();
    const mapContainer = useRef();
    const codeMirrorContainer = useRef();
    const editorRef = useRef();
    const layerCollection = useRef(
        new Collection([
            new TileLayer({
                id: 'osm',
                source: new OSM(),
            }),
        ])
    );

    const [layers, setLayers] = useState([
        {id: 'osm', name: 'openstreetmap', type: 'TMS', checked: true},
    ]);
    const [addVisible, setAddVisible] = useState(false);
    const [layerName, setLayerName] = useState('');
    const [layerType, setLayerType] = useState('WMS');
    const [nameError, setNameError] = useState(false);

    useEffect(initMap, []);

    useEffect(() => {
        // bind the ol Class in window, so that run in codemirror
        window.TileLayer = TileLayer;
        window.TileWMS = TileWMS;
        window.WMTS = WMTS;
        window.WMTSTileGrid = WMTSTileGrid;
        window.XYZ = XYZ;

        const startState = EditorState.create({
            doc: WMSCode,
            extensions: [basicSetup, javascript()],
        });

        editorRef.current = new EditorView({
            state: startState,
            parent: codeMirrorContainer.current,
        });

        return () => {
            window.TileLayer = null;
            window.TileWMS = null;
            window.WMTS = null;
            window.WMTSTileGrid = null;
            window.XYZ = null;
        };
    }, []);

    function initMap() {
        mapRef.current = new Map({
            target: mapContainer.current,
            view: new View({
                center: [0, 0],
                zoom: 3,
            }),
            layers: layerCollection.current,
        });
    }

    function onCheckboxChange(event, index) {
        const newItems = _cloneDeep(layers);
        newItems[index].checked = event.target.checked;

        changeLayerVisible(index, event.target.checked);
        setLayers(newItems);
    }

    function onDragStart(event, index) {
        event.dataTransfer.setData('text/plain', index);
    }

    function onDragOver(event) {
        event.preventDefault();
    }

    function onDrop(event, index) {
        const draggedIndex = event.dataTransfer.getData('text/plain');
        const draggedItem = layers[draggedIndex];
        const newItems = _cloneDeep(layers);

        newItems.splice(draggedIndex, 1);
        newItems.splice(index, 0, draggedItem);
        setLayers(newItems);
        changeLayerOrder(newItems);
    }

    // todo: use `collection.setAt` or `insertAt` has an error
    // in ol/layer/Group.js maybe layer key not match.
    // So I clear the collection and refresh order
    function changeLayerOrder(arr) {
        const layerArr = layerCollection.current.getArray();
        
        arr = arr.map(item => {
            const layer = layerArr.find(l => l.get('id') === item.id);
            if (layer) {
                return layer;
            } else {
                throw new Error(`layer id: ${id} not find`);
            }
        });
        
        layerCollection.current.clear();
        layerCollection.current.extend(arr);
    }

    function changeLayerVisible(index, visible) {
        const layer = layerCollection.current.item(index);

        layer.setVisible(visible);
    }

    function onAddLayer() {
        if (!layerName.trim()) {
            setNameError(true);
            return;
        }
        const arr = _cloneDeep(layers);

        const code = editorRef.current.state.doc.toString();

        const layer = eval(code);
        const id = arr.length;
        layer.set('id', id);
        layerCollection.current.push(layer);

        arr.push({
            name: layerName,
            type: layerType,
            checked: true,
            id,
        });
        setLayers(arr);
        setAddVisible(false);
        setLayerName('');
    }

    function onLayerTypeChange(e) {
        const type = e.target.value;
        const doc = editorRef.current.state.doc;

        const updatedDoc = {
            WMS: WMSCode,
            WMTS: WMTSCode,
            TMS: TMSCode
        }[type];
        
        editorRef.current.dispatch({
            changes: {from: 0, to: doc.length, insert: updatedDoc},
        });

        setLayerType(type);
    }

    function onDeleteLayer(index) {
        const arr = _cloneDeep(layers);
        
        arr.splice(index, 1);
        setLayers(arr);

        layerCollection.current.removeAt(index);
    }

    function onLayerNameChange(e) {
        setLayerName(e.target.value);
        setNameError(false);
    }

    return (
        <div className="h-full flex">
            <Modal
                title="Add Layer"
                visible={addVisible}
                onClose={() => setAddVisible(false)}
                onOk={onAddLayer}
            >
                <div className="mb-2">
                    <label htmlFor="" className="inline-block w-28">
                        Layer name:{' '}
                    </label>
                    <input
                        type="text"
                        value={layerName}
                        className={c('border border-gray-300 outline-0', {
                            'border-orange-600': nameError,
                        })}
                        onChange={onLayerNameChange}
                    />
                </div>
                <div className="mb-2">
                    <label htmlFor="" className="inline-block w-28">
                        Type:{' '}
                    </label>
                    <select
                        className="border border-gray-300 px-2 py-1 mr-2"
                        onChange={onLayerTypeChange}
                    >
                        {SUPPORT_TYPE.map(type => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="" className="inline-block w-28">
                        Params:{' '}
                    </label>
                    <div ref={codeMirrorContainer} className="max-h-60 overflow-auto"></div>
                </div>
            </Modal>
            <div className="h-full bg-white shadow rounded w-1/4 py-3">
                <p className="border-b border-gray-300 pl-3">
                    Layer list you can drag the order and check the visible
                </p>
                <ul className="space-y-2 px-2">
                    {layers.map((item, index) => (
                        <li
                            key={item.id}
                            className="flex items-center justify-between"
                            draggable
                            onDragStart={event => onDragStart(event, index)}
                            onDragOver={onDragOver}
                            onDrop={event => onDrop(event, index)}
                        >
                            <div>
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={item.checked}
                                    onChange={event => onCheckboxChange(event, index)}
                                />
                                <span className="text-gray-800">
                                    {item.name}({item.type})
                                </span>
                            </div>
                            <Image
                                src={deleteSvg}
                                width={15}
                                alt="delete"
                                className="cursor-pointer"
                                onClick={() => onDeleteLayer(index)}
                            />
                        </li>
                    ))}
                </ul>
                <button
                    className="border-gray-300 border px-2 ml-2 mt-2"
                    onClick={() => setAddVisible(true)}
                >Add Layer</button>
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
