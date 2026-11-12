"use client";

import { useState } from "react";
import Link from "next/link";
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/MenuOutlined';

const categories = ["Mobile games", "Games", "PSN", "Xbox", "Nintendo"];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-4 lg:px-8">
        <button
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close categories menu" : "Open categories menu"}
          className="order-first rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 lg:order-last"
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          <MenuIcon />
        </button>

        <Link className="shrink-0 text-2xl font-black tracking-[-0.08em] text-[#35c66b]" href="/">
          ENEBA
        </Link>

        <form className="hidden max-w-xl flex-1 md:block" role="search">
          <label className="sr-only" htmlFor="site-search">
            Search
          </label>
          <div className="flex items-center rounded-lg bg-slate-100 px-4 text-slate-500 transition focus-within:ring-2 focus-within:ring-[#35c66b]">
            <SearchIcon />
            <input
              className="w-full bg-transparent px-3 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              id="site-search"
              placeholder="Search for games, gift cards and more"
              type="search"
            />
          </div>
        </form>

        <nav className="ml-auto flex items-center gap-3 text-sm font-semibold text-slate-700">
          <a className="rounded-lg px-3 py-2 transition hover:bg-slate-100" href="/login">
            Log in
          </a>
          <a
            className="rounded-lg bg-[#35c66b] px-4 py-2 text-white transition hover:bg-[#2eae5e]"
            href="/register"
          >
            Register
          </a>
        </nav>
      </div>

      <div className="border-t border-slate-100 px-5 py-3 md:hidden">
        <form className="flex items-center rounded-lg bg-slate-100 px-4 text-slate-500" role="search">
          <SearchIcon />
          <label className="sr-only" htmlFor="mobile-site-search">
            Search
          </label>
          <input
            className="w-full bg-transparent px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            id="mobile-site-search"
            placeholder="Search"
            type="search"
          />
        </form>
      </div>

      {menuOpen && (
        <nav aria-label="Categories" className="border-t border-slate-200 bg-slate-50">
          <div className="mx-auto flex max-w-7xl flex-col px-5 py-3 lg:flex-row lg:gap-8 lg:px-8">
            {categories.map((category) => (
              <a
                className="border-b border-slate-200 py-3 text-sm font-semibold text-slate-700 transition last:border-0 hover:text-[#23a956] lg:border-0 lg:py-2"
                href="#"
                key={category}
              >
                {category}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
