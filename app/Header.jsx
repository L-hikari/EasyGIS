import Image from "next/image";
import Link from "next/link";

export default function Header() {
    return (
        <div className="flex justify-between items-center w-full h-10 bg-gray-700">
            <Link href="/" className="w-20 text-center text-white">
                <Image
                    src="/images/easygis.png"
                    alt="easygis-logo"
                    width={35}
                    height={35}
                />
            </Link>
            <a href="https://github.com/L-hikari/EasyGIS" target="_blank" className="w-10 text-center text-white">
                <Image
                    src="/images/github.svg"
                    alt="github"
                    width={35}
                    height={35}
                />
            </a>
        </div>
    );
}