import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator as CalcIcon, Zap, ArrowLeft } from 'lucide-react';

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

export default function Calculator() {
    const [form, setForm] = useState({ principal: '', rate: '', duration: '', interestType: 'SIMPLE', interestFrequency: 'MONTHLY' });
    const [result, setResult] = useState(null);

    const calculate = (e) => {
        e.preventDefault();
        const P = Number(form.principal), r = Number(form.rate), t = Number(form.duration);
        if (!P || !r || !t) return;
        const mr = form.interestFrequency === 'YEARLY' ? r / 12 / 100 : r / 100;
        const total = form.interestType === 'SIMPLE' ? P * (1 + mr * t) : P * Math.pow(1 + mr, t);
        const totalInterest = total - P;
        setResult({
            principal: P,
            totalInterest: totalInterest.toFixed(2),
            totalAmount: total.toFixed(2),
            monthlyInterest: (totalInterest / t).toFixed(2),
        });
    };

    const clear = () => { setForm({ principal: '', rate: '', duration: '', interestType: 'SIMPLE', interestFrequency: 'MONTHLY' }); setResult(null); };
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    return (
        <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center p-4 transition-colors duration-200">
            <div className="w-full max-w-lg">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/20">
                        <CalcIcon className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-[var(--text-main)]">Interest Calculator</h1>
                    <p className="text-[var(--text-muted)] mt-1">Simple & Compound interest calculator</p>
                    <Link to="/dashboard" className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity"><ArrowLeft size={14} />Dashboard</Link>
                </div>

                <div className="card space-y-4">
                    <form onSubmit={calculate} className="space-y-4">
                        <div>
                            <label className="label">Principal Amount (₹)</label>
                            <input id="calc-principal" type="number" placeholder="e.g. 50000" className="input" value={form.principal} onChange={e => set('principal', e.target.value)} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="label">Interest Rate (%)</label>
                                <input id="calc-rate" type="number" step="0.01" placeholder="e.g. 2" className="input" value={form.rate} onChange={e => set('rate', e.target.value)} required />
                            </div>
                            <div>
                                <label className="label">Duration (months)</label>
                                <input id="calc-duration" type="number" placeholder="e.g. 12" className="input" value={form.duration} onChange={e => set('duration', e.target.value)} required />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="label">Interest Type</label>
                                <div className="grid grid-cols-2 gap-1">
                                    {['SIMPLE', 'COMPOUND'].map(t => (
                                        <button key={t} type="button" onClick={() => set('interestType', t)}
                                            className={`py-2 rounded-lg text-xs font-semibold transition-all ${form.interestType === t ? 'bg-blue-600 text-white' : 'bg-[var(--nav-hover)] border border-[var(--border-color)] text-[var(--text-main)] hover:brightness-95'}`}>{t}</button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="label">Rate Frequency</label>
                                <div className="grid grid-cols-2 gap-1">
                                    {['MONTHLY', 'YEARLY'].map(f => (
                                        <button key={f} type="button" onClick={() => set('interestFrequency', f)}
                                            className={`py-2 rounded-lg text-xs font-semibold transition-all ${form.interestFrequency === f ? 'bg-blue-600 text-white' : 'bg-[var(--nav-hover)] border border-[var(--border-color)] text-[var(--text-main)] hover:brightness-95'}`}>{f}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button id="calc-btn" type="submit" className="btn-primary flex items-center justify-center gap-2"><Zap size={16} />Calculate</button>
                            <button type="button" onClick={clear} className="btn-secondary">Clear</button>
                        </div>
                    </form>

                    {result && (
                        <div className="border-t border-[var(--border-color)] pt-4 space-y-3">
                            <h3 className="font-semibold text-[var(--text-main)]">Results</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    ['Principal', fmt(result.principal), 'text-white'],
                                    ['Monthly Interest', fmt(result.monthlyInterest), 'text-yellow-400'],
                                    ['Total Interest', fmt(result.totalInterest), 'text-orange-400'],
                                    ['Total Payable', fmt(result.totalAmount), 'text-blue-400'],
                                ].map(([k, v, c]) => (
                                    <div key={k} className="bg-[var(--nav-hover)] border border-[var(--border-color)] rounded-xl p-4">
                                        <p className="text-xs text-[var(--text-muted)]">{k}</p>
                                        <p className={`font-bold text-lg mt-0.5 ${c}`}>{v}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
