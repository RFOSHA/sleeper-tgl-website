// 'use client';

// import Link from 'next/link';
// import Image from 'next/image';
// import { usePathname } from 'next/navigation';

// export default function Navbar() {
//   const pathname = usePathname();

//   const navItems = [
//     { href: '/weekly', label: 'Weekly Scores' },
//     { href: '/league', label: 'Season Leaderboard' },
//     { href: '/standings', label: 'Standings' },
//     { href: '/playoffs', label: 'Playoffs' }
//   ];

//   return (
//     <nav className="bg-gray-900 text-white px-6 py-4 shadow-md">
//       <div className="max-w-5xl mx-auto flex items-center justify-between">
//         <Link href="/" className="flex items-center space-x-3">
//           <Image
//             src="/tgl_logo.png"
//             alt="The Giving League Logo"
//             width={40}
//             height={40}
//             className="rounded-md"
//           />
//           <span className="text-lg font-bold tracking-wide">The Giving League</span>
//         </Link>
//         <div className="space-x-6">
//           {navItems.map(({ href, label }) => (
//             <Link
//               key={href}
//               href={href}
//               className={`hover:text-purple-400 transition ${
//                 pathname === href ? 'text-purple-400 font-semibold' : 'text-gray-300'
//               }`}
//             >
//               {label}
//             </Link>
//           ))}
//         </div>
//       </div>
//     </nav>
//   );
// }


'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { href: '/weekly', label: 'Weekly Scores' },
    { href: '/league', label: 'Season Leaderboard' },
    { href: '/standings', label: 'Standings' },
    { href: '/playoffs', label: 'Playoffs' },
  ];

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md">
      <div className="max-w-5xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/tgl_logo.png"
            alt="The Giving League Logo"
            width={40}
            height={40}
            className="rounded-md"
          />
          <span className="text-lg font-bold tracking-wide">The Giving League</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-6">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`hover:text-purple-400 transition ${
                pathname === href ? 'text-purple-400 font-semibold' : 'text-gray-300'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl focus:outline-none"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-3 bg-gray-800 rounded-lg shadow-lg py-3 px-4 space-y-3">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`block text-lg ${
                pathname === href ? 'text-purple-400 font-semibold' : 'text-gray-300'
              }`}
              onClick={() => setMenuOpen(false)} // close menu after clicking
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
