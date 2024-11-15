import React, {lazy, Suspense} from 'react';
import {HashRouter, Route, Routes} from 'react-router-dom';
import RootLayout from './components/Layout';
import Home from './pages/Home';
const RasterPreview = lazy(() => import('./pages/raster/Preview'));
const VecterDataTransform = lazy(() => import('./pages/vector/Transform'));
const VectorPreview = lazy(() => import('./pages/vector/Preview'));
const DrawAndModify = lazy(() => import('./pages/vector/Draw'));

export default function App() {
    return (
        <HashRouter>
            <RootLayout>
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        <Route path="/vector/draw" element={<DrawAndModify />} />
                        <Route path="/vector/preview" element={<VectorPreview />} />
                        <Route path="/vector/transform" element={<VecterDataTransform />} />
                        <Route path="/raster/preview" element={<RasterPreview />} />
                        <Route path="*" element={<Home />} />
                    </Routes>
                </Suspense>
            </RootLayout>
        </HashRouter>
    );
}
