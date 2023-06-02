'use client';
import React, {useEffect, useState} from 'react';
import {SUPPORT_FORMAT, isJSONString} from '../../tools';
import {transform} from 'ol/proj';
import {SUPPORT_PROJ} from '../../tools/projection';
import {WKT_TYPE} from '../../tools/wkt';
import {geojson2Geometry, geometry2Geojson} from '../../tools/geojson';

export default function VecterDataTransform() {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [inputType, setInputType] = useState(SUPPORT_PROJ[0]);
    const [outputType, setOutputType] = useState(SUPPORT_PROJ[1]);
    const [inputFormat, setInputFormat] = useState(SUPPORT_FORMAT[0]);
    const [outputFormat, setOutputFormat] = useState(SUPPORT_FORMAT[0]);

    useEffect(onTransform, [inputText, inputType, outputType]);

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
            /** @type {import('ol/geom').Geometry} */
            let geometry;
            /** @type {import('../../tools/projection').ProjOptions} */
            const sourceOptions = {
                dataProjection: inputType,
                featureProjection: outputType,
            };
            const destinationOptions = {
                dataProjection: outputType,
                featureProjection: inputType,
            };

            if (isJSONString(inputText)) {
                geometry = geojson2Geometry(JSON.parse(inputText), sourceOptions);

                output = JSON.stringify(geometry2Geojson(geometry, destinationOptions));
            } else if (inputText.startsWith(WKT_TYPE)) {
            } else {
                output = transformCoordString(inputText);
            }

            setOutputText(output);
        } catch (error) {
            console.log(error);
            // setTextError(true);
        }
    }

    /**
     *
     * @param {string} str
     */
    function transformCoordString(str) {
        const source = str.split(',');
        const destination = [];

        for (let i = 0; i < source.length; i += 2) {
            const res = transform([source[i], source[i + 1]], inputType, outputType);

            destination.push(res);
        }

        return destination.join();
    }

    return (
        <div className="h-screen flex justify-center items-center">
            <div className="flex">
                <div className="mr-2">
                    <div className="flex mb-2">
                        <label className="block mr-2">input:</label>
                        <select
                            className="bg-gray-200 px-2 py-1 mr-2"
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
                            className="bg-gray-200 px-2 py-1"
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
                        className="w-96 h-40 bg-gray-200 p-2"
                    ></textarea>
                </div>
                <div>
                    <div className="flex mb-2">
                        <label className="block mr-2">output:</label>
                        <select
                            className="bg-gray-200 px-2 py-1"
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
                            className="bg-gray-200 px-2 py-1"
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
                        value={outputText}
                        disabled
                        className="w-96 h-40 bg-gray-200 p-2"
                    ></textarea>
                </div>
            </div>
        </div>
    );
}
