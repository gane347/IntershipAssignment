"use client";
import FacebookIcon from '@mui/icons-material/FacebookOutlined';

function InstagramIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20">
      <rect height="16" rx="4" stroke="currentColor" strokeWidth="2" width="16" x="4" y="4" />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" fill="currentColor" r="1" />
    </svg>
  );
}

const columns = [
  { title: "About Eneba", links: ["About us", "Contact us"] },
  { title: "Buy", links: ["How to buy", "Collections", "Discounts"] },
  { title: "Help", links: ["FAQ", "How to activate game"] },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {columns.map((column) => (
          <div key={column.title}>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">{column.title}</h2>
            <ul className="space-y-3 text-sm">
              {column.links.map((link) => (
                <li key={link}>
                  <a className="transition hover:text-[#5cdb88]" href="#">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Follow Us</h2>
          <div className="flex gap-3">
            <a aria-label="Facebook" className="rounded-full bg-slate-800 p-3 transition hover:bg-[#35c66b]" href="#">
              <FacebookIcon />
            </a>
            <a aria-label="Instagram" className="rounded-full bg-slate-800 p-3 transition hover:bg-[#35c66b]" href="#">
              <InstagramIcon />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 px-5 py-5 text-center text-xs text-slate-500">
        No rights reserved. This is a clone of Eneba for the application purpose only. All the content belongs to their respective owners.
      </div>
    </footer>
  );
}
