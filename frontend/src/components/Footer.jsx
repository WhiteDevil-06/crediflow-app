import React from 'react';

export default function Footer() {
    return (
        <footer className="w-full py-6 px-4 bg-[var(--bg-main)] border-t border-[var(--border-color)] mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center space-y-2">
                <p className="text-sm text-[var(--text-main)] font-semibold">
                    &copy; {new Date().getFullYear()} CrediFlow
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                    Project under UNLOX Training Program for Client/Company: Trivion Technology
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                    Credits: Rakshith Raghavendra and Athish Kashyappa
                </p>
                <div className="pt-2">
                    <p className="text-[10px] text-gray-400 dark:text-gray-500">
                        <a href="https://www.flaticon.com/free-icons/fintech" title="fintech icons" className="hover:text-blue-500 transition-colors" target="_blank" rel="noopener noreferrer">
                            Fintech icons created by kornkun - Flaticon
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
