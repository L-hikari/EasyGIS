import "ol/ol.css";
import './globals.css';
import Header from "./Header.jsx";

export default function RootLayout({children}) {
    return (
        <html lang="en" className="h-full">
            <title>EasyGIS</title>
            <body className="flex flex-col h-full bg-gray-50">
                <Header />
                {children}
            </body>
        </html>
    );
}
