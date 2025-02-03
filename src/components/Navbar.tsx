"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

const Navbar = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative">
      <div className="h-12 text-red-500 p-4 flex items-center justify-between border-b-2 border-b-red-500 uppercase md:h-24 lg:px-20 xl:px-40 bg-white">
        {/* LEFT LINKS */}
        <div className="hidden md:flex gap-4 flex-1">
          <Link href="/">Homepage</Link>
          <Link href="/share">Partage</Link>
          <Link href="/decouverte">Decouverte</Link>
          {session && <Link href="/dashboard">Profile</Link>}
        </div>
        {/* LOGO */}
        <div className="text-xl md:font-bold flex-1 md:text-center">
          <Link href="/">TOQUE EN DUEL</Link>
        </div>
        {/* RIGHT LINKS */}
        <div className="hidden md:flex gap-4 items-center justify-end flex-1">
          {session ? (
            <div>
              <span>Welcome, {session.user?.email}</span>
              <button
                onClick={() => signOut()}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400 ml-4"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link href="/register">
                <button className="text-gray-700 hover:text-red-500">
                  Inscription
                </button>
              </Link>
              <Link href="/login">
                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400">
                  Connexion
                </button>
              </Link>
            </div>
          )}
        </div>
        {/* Hamburger Menu Icon */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-red-500 focus:outline-none"
          >
            ☰
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden z-50`}
      >
        <div className="flex flex-col items-start p-4">
          <Link href="/" onClick={() => setIsMenuOpen(false)}>Homepage</Link>
          <Link href="/share" onClick={() => setIsMenuOpen(false)}>Partage</Link>
          <Link href="/decouverte" onClick={() => setIsMenuOpen(false)}>Decouverte</Link>
          {session && <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>Profile</Link>}
          {session ? (
            <button
              onClick={() => {
                signOut();
                setIsMenuOpen(false);
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400 mt-4"
            >
              Logout
            </button>
          ) : (
            <>
              <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                <button className="text-gray-700 hover:text-red-500 mt-4">
                  Inscription
                </button>
              </Link>
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400 mt-2">
                  Connexion
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;