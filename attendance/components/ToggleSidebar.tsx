'use client';

import { IoMenu } from "react-icons/io5";

export default function ToggleSidebar({ onToggle }: { onToggle?: () => void }) {
    return (
        <div className="fixed top-4 left-7 z-50">
            <IoMenu size={32} onClick={onToggle} className="cursor-pointer text-white transition-all duration-300 ease-in-out hover:scale-125" />
        </div>
    );
}