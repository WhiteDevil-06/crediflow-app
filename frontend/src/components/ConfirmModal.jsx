import { X } from 'lucide-react';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm' }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
            <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl p-6 w-full max-w-sm shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-[var(--text-main)]">{title}</h3>
                    <button onClick={onCancel} className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <p className="text-[var(--text-muted)] mb-6 text-sm">
                    {message}
                </p>
                <div className="flex justify-end gap-3">
                    <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-semibold bg-[var(--nav-hover)] text-[var(--text-main)] hover:brightness-95 transition-all border border-[var(--border-color)]">
                        Cancel
                    </button>
                    <button onClick={() => { onConfirm(); onCancel(); }} className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-all shadow-md shadow-red-500/20">
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
