import logoWhite from "../assets/Logos/Light.png"
import logoDark from "../assets/Logos/Dark.png"
import { Link } from "react-router-dom";

export default function Logo({ varient = "light", logoOnly = false }) {
    if (varient == "dark") {
        return (
            <Link to={"/"}>
                <div className="flex gap-1 items-center">
                    <img className="h-10 w-10 aspect-square object-cover" src={logoDark} alt="Skill-Ustad" />
                    {!logoOnly && (
                        <p className="font-bold text-white lg:text-3xl md:text-2xl sm:text-xl text-xl text-nowrap">
                        Skill-Ustad
                    </p>
                    )}
                </div>
            </Link>
        );
    } else {
        return (
            <Link to={"/"}>
                <div className="flex gap-1 items-center">
                    <img className="h-10 w-10 aspect-square object-cover" src={logoWhite} alt="Skill-Ustad" />
                    {!logoOnly && (
                        <p className="font-bold text-black lg:text-3xl md:text-2xl sm:text-xl text-xl text-nowrap">
                            Skill-Ustad
                        </p>
                    )}
                </div>
            </Link>
        );
    }
}