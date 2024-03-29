'use client';
import React, {useEffect, useState} from 'react';
import {SUPPORT_FORMAT, isJSONString} from '../../tools';
import {transform} from 'ol/proj';
import {SUPPORT_PROJ} from '../../tools/projection';
import {WKT_TYPE, geometry2Wkt, wkt2Geometry} from '../../tools/wkt';
import {geojson2Geometry, geometry2Geojson} from '../../tools/geojson';
import c from 'classnames';
import { Geometry, Point, Polygon } from 'ol/geom';

export default function VecterDataTransform() {
    const [textError, setTextError] = useState(false);
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [inputType, setInputType] = useState(SUPPORT_PROJ[0]);
    const [outputType, setOutputType] = useState(SUPPORT_PROJ[1]);
    const [inputFormat, setInputFormat] = useState(SUPPORT_FORMAT[0]);
    const [outputFormat, setOutputFormat] = useState(SUPPORT_FORMAT[0]);

    useEffect(onTransform, [inputText, inputType, outputType, inputFormat, outputFormat]);

    function onInputTextChange(e) {
        setInputText(e.target.value);
    }

    function onInputTypeChange(e) {
        setInputType(e.target.value);
    }

    function onOutputTypeChange(e) {
        setOutputType(e.target.value);
    }

    function onInputFormatChange(e) {
        setInputFormat(e.target.value);
    }

    function onOutputFormatChange(e) {
        setOutputFormat(e.target.value);
    }

    function onTransform() {
        if (!inputText.trim()) {
            return;
        }

        try {
            let output = '';
            /** @type {Geometry} */
            let geometry;
            /** @type {import('../../tools/projection').ProjOptions} */
            const inputOptions = {
                dataProjection: inputType,
                featureProjection: 'EPSG:3857',
            };
            const outputOptions = {
                dataProjection: outputType,
                featureProjection: 'EPSG:3857',
            };

            // Transform input text
            if (inputFormat === 'WKT') {
                geometry = wkt2Geometry(inputText, inputOptions);
            }
            else if (inputFormat === 'GeoJSON') {
                geometry = geojson2Geometry(JSON.parse(inputText), inputOptions);
            }
            else if (inputFormat === 'x,y,x,y') {
                geometry = transformCoordString(inputText);
            }

            // Geometry to output text
            if (outputFormat === 'WKT') {
                output = geometry2Wkt(geometry, outputOptions);
            }
            else if (outputFormat === 'GeoJSON') {
                output = JSON.stringify(geometry2Geojson(geometry, outputOptions));
            }
            else if (outputFormat === 'x,y,x,y') {
                let coords = geometry.getCoordinates();
                const geometryType = geometry.getType();

                if (geometryType === 'Point') {
                    output = transform(coords, 'EPSG:3857', outputType).join(',');
                }
                else {
                    coords = coords.flat(Infinity);
                    for (let i = 0; i < coords.length; i += 2) {
                        const res = transform([coords[i], coords[i + 1]], 'EPSG:3857', outputType);
                        output += `${res.join(',')},`;
                    }
                }
            }

            setOutputText(output);
        } catch (error) {
            console.log(error);
            setTextError(true);
        }
    }

    /**
     * @param {string} str
     * @returns {Geometry}
     */
    function transformCoordString(str) {
        const source = str.split(',');
        const destination = [];

        for (let i = 0; i < source.length; i += 2) {
            const res = transform([source[i], source[i + 1]], inputType, 'EPSG:3857');

            destination.push(res);
        }

        if (destination.length === 1) {
            return new Point(destination[0]);;
        }

        return new Polygon([destination]);
    }

    return (
        <div className="h-screen flex justify-center items-center">
            <div className="flex">
                <div className="mr-2">
                    <div className="flex mb-2">
                        <label className="block mr-2">input:</label>
                        <select
                            className="border border-gray-300 px-2 py-1 mr-2"
                            onChange={onInputTypeChange}
                            value={inputType}
                        >
                            {SUPPORT_PROJ.map(proj => (
                                <option key={proj} value={proj}>
                                    {proj}
                                </option>
                            ))}
                        </select>
                        <select
                            className="border border-gray-300 px-2 py-1"
                            onChange={onInputFormatChange}
                            value={inputFormat}
                        >
                            {SUPPORT_FORMAT.map(proj => (
                                <option key={proj} value={proj}>
                                    {proj}
                                </option>
                            ))}
                        </select>
                    </div>
                    <textarea
                        onChange={onInputTextChange}
                        placeholder="input coordinate"
                        className={c('w-96 h-40 border border-gray-300 p-2 outline-none', {
                            'border-orange-600': textError
                        })}
                    ></textarea>
                </div>
                <div>
                    <div className="flex mb-2">
                        <label className="block mr-2">output:</label>
                        <select
                            className="border border-gray-300 px-2 py-1 mr-2"
                            onChange={onOutputTypeChange}
                            value={outputType}
                        >
                            {SUPPORT_PROJ.map(proj => (
                                <option key={proj} value={proj}>
                                    {proj}
                                </option>
                            ))}
                        </select>
                        <select
                            className={'px-2 py-1 border border-gray-300'}
                            onChange={onOutputFormatChange}
                            value={outputFormat}
                        >
                            {SUPPORT_FORMAT.map(proj => (
                                <option key={proj} value={proj}>
                                    {proj}
                                </option>
                            ))}
                        </select>
                    </div>
                    <textarea
                        value={outputText}
                        disabled
                        className="w-96 h-40 bg-gray-200 p-2 cursor-not-allowed"
                    ></textarea>
                </div>
            </div>
        </div>
    );
}
