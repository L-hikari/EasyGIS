import {Fragment} from 'react';
import Image from 'next/image';
import eyeSvg from "./images/eye.svg";
import transformSvg from "./images/transform.svg";
import drawSvg from "./images/draw.svg";
import pictureSvg from "./images/picture.svg";
import Link from 'next/link';

/** @type {import("next").Metadata} */
export const metadata = {
    keywords: 'gis, gis tool, map, openlayers',
    description: 'Easy to use and lightweight gis tool for web'
};

export default function Page() {
    return (
        <Fragment>
            <section className="bg-gray-200 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl font-semibold mb-4">EasyGIS</h2>
                    <p className="text-gray-600">Easy to use and lightweight gis tool for web</p>
                </div>
            </section>

            <section className="py-8">
                <div className="max-w-4xl mx-auto grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Link href="/vector/preview" className="bg-white rounded-lg shadow-md p-6 duration-300 hover:scale-105">
                        <Image src={eyeSvg} width={100} alt="Preview" className="mb-4 m-auto" />
                        <h3 className="text-xl font-semibold mb-2">Vector Data Preview</h3>
                        <p className="text-gray-600">Input vector data and preview on the map</p>
                    </Link>
                    <Link href="/vector/transform" className="bg-white rounded-lg shadow-md p-6 duration-300 hover:scale-105">
                        <Image src={transformSvg} width={100} alt="Transform" className="m-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Data Transform</h3>
                        <p className="text-gray-600">Transform data format and coordinate system</p>
                    </Link>
                    <Link href="/vector/draw" className="bg-white rounded-lg shadow-md p-6 duration-300 hover:scale-105">
                        <Image src={drawSvg} width={100} alt="Draw" className="m-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Feature Operate</h3>
                        <p className="text-gray-600">Draw and Modify Feature</p>
                    </Link>
                    <Link href="/raster/preview" className="bg-white rounded-lg shadow-md p-6 duration-300 hover:scale-105">
                        <Image src={pictureSvg} width={100} alt="Draw" className="m-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Raster Data Preview</h3>
                        <p className="text-gray-600">Preview wmts/wms/tms layer</p>
                    </Link>
                </div>
            </section>
        </Fragment>
    );
}
