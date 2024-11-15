import Header from "./Header.jsx";

export default function RootLayout({children}) {
    return (
        <div className="flex flex-col h-full bg-gray-50">
            <Header />
            {children}
        </div>
    );
}
