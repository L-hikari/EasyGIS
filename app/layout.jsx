import './globals.css';
import Header from "./Header.jsx";

export default function RootLayout({children}) {
    return (
        <html lang="en">
            <title>EasyGIS</title>
            <body>
                <Header />
                {children}
            </body>
        </html>
    );
}
