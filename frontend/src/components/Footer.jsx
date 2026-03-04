import React from 'react';

export default function Footer() {
    return (
        <footer className="w-full py-4 px-6 bg-[var(--bg-main)] border-t border-[var(--border-color)] mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-[11px] text-[var(--text-muted)] gap-3">
                <div className="flex items-center gap-3">
                    <span className="font-semibold text-[var(--text-main)] text-xs">&copy; {new Date().getFullYear()} CrediFlow</span>
                    <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-md font-mono text-[9px] font-bold tracking-widest border border-blue-500/20">V2.0</span>
                </div>

                <div className="flex flex-col md:flex-row items-center text-center gap-1 md:gap-2">
                    <span>UNLOX Project for Trivion Technology</span>
                    <span className="hidden md:inline text-[var(--border-color)]">|</span>
                    <span>Rakshith Raghavendra & Athish Kashyappa</span>
                </div>

                <div>
                    <a href="https://www.flaticon.com/free-icons/fintech" title="fintech icons" className="hover:text-[var(--text-main)] transition-colors" target="_blank" rel="noopener noreferrer">
                        Icons by Flaticon
                    </a>
                </div>
            </div>
        </footer>
    );
}
