import { Link } from "react-router-dom";
import EasyGISPng from "../images/easygis.png";
import GithubSvg from "../images/github.svg";

export default function Header() {
    return (
        <div className="flex justify-between items-center w-full h-10 bg-gray-700">
            <Link to="/" className="w-20 text-center text-white">
                <img
                    src={EasyGISPng}
                    alt="easygis-logo"
                    width={35}
                    height={35}
                />
            </Link>
            <a href="https://github.com/L-hikari/EasyGIS" target="_blank" className="w-10 text-center text-white">
                <img
                    src={GithubSvg}
                    alt="github"
                    width={35}
                    height={35}
                />
            </a>
        </div>
    );
}