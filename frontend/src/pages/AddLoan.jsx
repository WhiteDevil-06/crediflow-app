import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loanAPI, customerAPI } from '../services/api';
import { ArrowLeft, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

function calcPreview(form) {
    const { principalAmount, interestRate, durationMonths, interestType, interestFrequency } = form;
    if (!principalAmount || !interestRate || !durationMonths) return null;
    const P = Number(principalAmount), r = Number(interestRate), t = Number(durationMonths);
    const mr = interestFrequency === 'YEARLY' ? r / 12 / 100 : r / 100;
    const total = interestType === 'SIMPLE' ? P * (1 + mr * t) : P * Math.pow(1 + mr, t);
    const totalInterest = total - P;
    return { monthlyInterest: (totalInterest / t).toFixed(2), totalInterest: totalInterest.toFixed(2), totalAmount: total.toFixed(2) };
}

export default function AddLoan() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const preCustomer = searchParams.get('customerId');
    const [customers, setCustomers] = useState([]);
    const [form, setForm] = useState({
        customerId: preCustomer || '', loanType: 'GIVEN', principalAmount: '',
        interestRate: '', interestType: 'SIMPLE', interestFrequency: 'MONTHLY',
        startDate: new Date().toISOString().slice(0, 10), durationMonths: '', notes: '',
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const preview = calcPreview(form);

    useEffect(() => {
        customerAPI.getAll().then(r => setCustomers(r.data.data));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => fd.append(k, v));
            if (file) fd.append('document', file);
            await loanAPI.create(fd);
            navigate('/loans');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create loan');
        } finally {
            setLoading(false);
        }
    };

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link to="/loans" className="p-2 bg-[var(--nav-hover)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] transition-all">
                    <ArrowLeft size={18} />
                </Link>
                <h2 className="text-xl font-bold text-[var(--text-main)]">New Loan</h2>
            </div>

            {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">{error}</div>}

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <form onSubmit={handleSubmit} className="lg:col-span-3 card space-y-4">
                    <div>
                        <label className="label">Customer *</label>
                        <select id="loan-customer" className="input" value={form.customerId} onChange={e => set('customerId', e.target.value)} required>
                            <option value="">Select customer</option>
                            {customers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="label">Loan Type *</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['GIVEN', 'TAKEN'].map(t => (
                                <button key={t} type="button" onClick={() => set('loanType', t)}
                                    className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${form.loanType === t ? t === 'GIVEN' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' : 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/30' : 'bg-[var(--nav-hover)] text-[var(--text-muted)] border border-[var(--border-color)] hover:brightness-95'}`}>
                                    {t === 'GIVEN' ? '↑ Given' : '↓ Taken'}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Principal (₹) *</label>
                            <input id="loan-amount" type="number" placeholder="10000" className="input" value={form.principalAmount} onChange={e => set('principalAmount', e.target.value)} required />
                        </div>
                        <div>
                            <label className="label">Interest Rate (%) *</label>
                            <input id="loan-rate" type="number" step="0.01" placeholder="2" className="input" value={form.interestRate} onChange={e => set('interestRate', e.target.value)} required />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Interest Type</label>
                            <select className="input" value={form.interestType} onChange={e => set('interestType', e.target.value)}>
                                <option value="SIMPLE">Simple</option>
                                <option value="COMPOUND">Compound</option>
                            </select>
                        </div>
                        <div>
                            <label className="label">Rate Frequency</label>
                            <select className="input" value={form.interestFrequency} onChange={e => set('interestFrequency', e.target.value)}>
                                <option value="MONTHLY">Monthly</option>
                                <option value="YEARLY">Yearly</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Start Date *</label>
                            <input type="date" className="input" value={form.startDate} onChange={e => set('startDate', e.target.value)} required />
                        </div>
                        <div>
                            <label className="label">Duration (months) *</label>
                            <input id="loan-duration" type="number" placeholder="12" className="input" value={form.durationMonths} onChange={e => set('durationMonths', e.target.value)} required />
                        </div>
                    </div>
                    <div>
                        <label className="label">Document (optional)</label>
                        <input type="file" accept=".jpg,.jpeg,.png,.pdf,.webp" onChange={e => setFile(e.target.files[0])}
                            className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-100 dark:file:bg-gray-700 file:text-gray-700 dark:file:text-gray-200 hover:file:bg-gray-200 dark:hover:file:bg-gray-600 cursor-pointer" />
                    </div>
                    <div>
                        <label className="label">Notes</label>
                        <textarea rows={2} placeholder="Optional notes" className="input resize-none" value={form.notes} onChange={e => set('notes', e.target.value)} />
                    </div>
                    <button id="create-loan-btn" type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Creating...' : 'Create Loan'}</button>
                </form>

                {/* Live Preview */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="card">
                        <h3 className="font-semibold text-[var(--text-main)] flex items-center gap-2 mb-4"><Calculator size={16} className="text-blue-500 dark:text-blue-400" />Interest Preview</h3>
                        {preview ? (
                            <div className="space-y-3">
                                <div className="flex justify-between"><span className="text-[var(--text-muted)] text-sm">Monthly Interest</span><span className="text-[var(--text-main)] font-medium">{fmt(preview.monthlyInterest)}</span></div>
                                <div className="flex justify-between"><span className="text-[var(--text-muted)] text-sm">Total Interest</span><span className="text-yellow-600 dark:text-yellow-400 font-medium">{fmt(preview.totalInterest)}</span></div>
                                <div className="border-t border-[var(--border-color)] pt-3 flex justify-between"><span className="text-[var(--text-main)] font-semibold">Total Payable</span><span className="text-blue-600 dark:text-blue-400 font-bold text-lg">{fmt(preview.totalAmount)}</span></div>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm text-center py-4">Fill in the form to see the preview</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
