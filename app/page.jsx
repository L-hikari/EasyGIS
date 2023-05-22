import {Fragment} from 'react';

export default function Page() {
    return (
        <Fragment>
            <section class="bg-gray-200 py-8">
                <div class="max-w-4xl mx-auto px-4">
                    <h2 class="text-3xl font-semibold mb-4">横幅标题</h2>
                    <p class="text-gray-600">横幅描述</p>
                </div>
            </section>

            <section class="py-8">
                <div class="max-w-4xl mx-auto grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div class="bg-white rounded-lg shadow-md p-6">
                        <img src="path/to/image1.jpg" alt="Image 1" class="w-full mb-4" />
                        <h3 class="text-xl font-semibold mb-2">功能标题 1</h3>
                        <p class="text-gray-600">功能简介 1</p>
                    </div>
                    <div class="bg-white rounded-lg shadow-md p-6">
                        <img src="path/to/image2.jpg" alt="Image 2" class="w-full mb-4" />
                        <h3 class="text-xl font-semibold mb-2">功能标题 2</h3>
                        <p class="text-gray-600">功能简介 2</p>
                    </div>
                </div>
            </section>
        </Fragment>
    );
}
