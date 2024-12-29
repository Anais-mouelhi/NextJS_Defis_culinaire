import React from "react";

import Link from "next/link";



const Navbar = () => {
  
  return (
    <div className="h-12 text-red-500 p-4 flex items-center justify-between border-b-2 border-b-red-500 uppercase md:h-24 lg:px-20 xl:px-40">
      {/* LEFT LINKS */}
      <div className="hidden md:flex gap-4 flex-1">
        <Link href="/">Homepage</Link>
        <Link href="/partage">Partage</Link>
        <Link href="/decouverte">Decouverte</Link>
        <Link href="/profile">Profile</Link>
      </div>
      {/* LOGO */}
      <div className="text-xl md:font-bold flex-1 md:text-center">
      
      </div>
      {/* MOBILE MENU */}
      <div className="md:hidden">
        
      </div>
      {/* RIGHT LINKS */}
      <div className="hidden md:flex gap-4 items-center justify-end flex-1">
       
      <div className="flex space-x-4">
         
          <div className="text-xl md:font-bold flex-1 md:text-center">
        <Link href="/">Massimo</Link>
      </div>
        </div>
       
      </div>
    </div>
  );
};

export default Navbar;