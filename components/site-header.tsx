"use client";

import { List, Moon, Sun, X } from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";

const navItems = [
  ["About", "/#about"],
  ["Projects", "/#projects"],
  ["Skills", "/#skills"],
  ["Contact", "/#contact"],
  ["Graphic design", "/graphic-design"],
] as const;

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  function toggleTheme() {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("dohn-theme", nextTheme);
  }

  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="Dohn Michael Varquez, home">
        DMV<span>/</span>
      </Link>

      <nav className="desktop-nav" aria-label="Primary navigation">
        {navItems.map(([label, href]) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
      </nav>

      <div className="header-actions">
        <div className="scroll-progress" aria-label="Page scroll progress">
          <span className="scroll-progress-track" aria-hidden="true">
            <span className="scroll-progress-fill" />
          </span>
          <span className="scroll-progress-value" aria-hidden="true" />
        </div>
        <button className="icon-button" type="button" onClick={toggleTheme} aria-label="Toggle color theme">
          <Sun className="theme-icon-light" size={19} weight="regular" />
          <Moon className="theme-icon-dark" size={19} weight="regular" />
        </button>
        <button className="icon-button menu-button" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? "Close menu" : "Open menu"}>
          {menuOpen ? <X size={20} weight="regular" /> : <List size={21} weight="regular" />}
        </button>
      </div>

      {menuOpen && (
        <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
          {navItems.map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)}>
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
