import type { FC } from "react";

import { Separator } from "@/components/ui/separator";

export const Footer: FC = () => {
  return (
    <footer className="flex flex-row px-3 justify-between bg-white text-xs py-2 border-t border-gray-200 text-gray-600">
      <div className="flex gap-2">
        <a href="/" target="_blank">
          Terms of Service
        </a>
        <Separator orientation="vertical" />
        <a href="/" target="_blank">
          Privacy Policy
        </a>
        <Separator orientation="vertical" />
        <a href="/" target="_blank">
          Contact
        </a>
      </div>
      <div>© 2026, Suyash Kale.</div>
    </footer>
  );
};
