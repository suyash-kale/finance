import type { FC } from "react";
import { Link } from "react-router";

import Logo from "@/assets/logo.jpg";

export const Header: FC = () => {
  return (
    <div className="flex items-center justify-between pr-3 bg-white shadow-inner border-b border-gray-200">
      <Link to="/" className="flex gap-2 items-center">
        <img src={Logo} alt="Logo" width={50} height={50} />
        <span className="text-2xl font-semibold">Finance</span>
      </Link>
      <nav className="flex gap-3 text-sm">
        <Link to="/sign-in" className="flex gap-4 items-center text-gray-600">
          Sign In
        </Link>
        <Link to="/sign-up" className="flex gap-4 items-center text-gray-600">
          Sign Up
        </Link>
      </nav>
    </div>
  );
};
