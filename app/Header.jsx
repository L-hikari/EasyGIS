import Image from "next/image";
import logo from "./images/easygis.png";
import github from "./images/github.svg";
import Link from "next/link";

export default function Header() {
    return (
        <div className="flex justify-between items-center w-full h-10 bg-gray-700">
            <Link href="/" className="w-20 text-center text-white">
                <Image
                    src={logo}
                    alt="easygis-logo"
                    width={35}
                />
            </Link>
            <a href="https://github.com/L-hikari" target="_blank" className="w-10 text-center text-white">
                <Image
                    src={github}
                    alt="github"
                    width={35}
                />
            </a>
        </div>
    );
}