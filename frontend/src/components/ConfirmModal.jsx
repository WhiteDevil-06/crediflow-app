import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', requireInput = null }) {
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (!isOpen) { setInputValue(''); }
    }, [isOpen]);

    if (!isOpen) return null;

    const isConfirmDisabled = requireInput && inputValue !== requireInput;

    const handleConfirm = () => {
        if (!isConfirmDisabled) {
            onConfirm();
            onCancel();
        }
    };

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

                {requireInput && (
                    <div className="mb-6 animate-in fade-in slide-in-from-top-2">
                        <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
                            Type <strong className="font-mono text-red-500 bg-red-500/10 px-1 py-0.5 rounded">{requireInput}</strong> to confirm:
                        </label>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="w-full rounded-xl px-4 py-2.5 bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-mono tracking-wide"
                            placeholder={requireInput}
                        />
                    </div>
                )}

                <div className="flex justify-end gap-3">
                    <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-semibold bg-[var(--nav-hover)] text-[var(--text-main)] hover:brightness-95 transition-all border border-[var(--border-color)]">
                        Cancel
                    </button>
                    <button
                        disabled={isConfirmDisabled}
                        onClick={handleConfirm}
                        className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-all shadow-md shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none">
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
