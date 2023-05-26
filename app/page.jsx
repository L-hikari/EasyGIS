import {Fragment} from 'react';
import Image from 'next/image';
import eyeSvg from "./images/eye.svg";
import transformSvg from "./images/transform.svg";
import Link from 'next/link';

export default function Page() {
    return (
        <Fragment>
            <section className="bg-gray-200 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl font-semibold mb-4">EasyGIS</h2>
                    <p className="text-gray-600">easy to use and lightweight gis tool for web</p>
                </div>
            </section>

            <section className="py-8">
                <div className="max-w-4xl mx-auto grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Link href="/vector/preview" className="bg-white rounded-lg shadow-md p-6 duration-300 hover:scale-105">
                        <Image src={eyeSvg} width={100} alt="Image 1" className="mb-4 m-auto" />
                        <h3 className="text-xl font-semibold mb-2">vector data preview</h3>
                        <p className="text-gray-600">input vector data and preview on the map</p>
                    </Link>
                    <div className="bg-white rounded-lg shadow-md p-6 duration-300 hover:scale-105">
                        <Image src={transformSvg} width={100} alt="Image 2" className="m-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">data transform</h3>
                        <p className="text-gray-600">transform data format and coordinate system</p>
                    </div>
                </div>
            </section>
        </Fragment>
    );
}
