import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loanAPI, customerAPI } from '../services/api';
import { ArrowLeft, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { calcLoanTotals, generateAmortizationSchedule } from '../utils/amortization';

export default function AddLoan() {
    const { formatCurrency } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const preCustomer = searchParams.get('customerId');
    const [customers, setCustomers] = useState([]);
    const [form, setForm] = useState({
        customerId: preCustomer || '', loanType: 'GIVEN', principalAmount: '',
        interestRate: '', interestType: 'SIMPLE', interestFrequency: 'MONTHLY',
        startDate: new Date().toISOString().slice(0, 10), duration: '', durationUnit: 'MONTHS', notes: '',
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSchedule, setShowSchedule] = useState(false);

    const preview = calcLoanTotals(form.principalAmount, form.interestRate, form.duration, form.durationUnit, form.interestType, form.interestFrequency);
    const schedule = showSchedule ? generateAmortizationSchedule(form.principalAmount, form.interestRate, form.duration, form.durationUnit, form.interestType, form.interestFrequency, form.startDate) : [];

    useEffect(() => {
        customerAPI.getAll().then(r => setCustomers(r.data.data));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => {
                if (k === 'duration' || k === 'durationUnit') return;
                fd.append(k, v);
            });
            fd.append('durationMonths', form.durationUnit === 'YEARS' ? String(Number(form.duration) * 12) : form.duration);
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
                            <label className="label">Principal *</label>
                            <input id="loan-amount" type="number" placeholder="10000" className="input" value={form.principalAmount} min="1" onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()} onChange={e => set('principalAmount', e.target.value)} required />
                        </div>
                        <div>
                            <label className="label">Interest Rate (% {form.interestFrequency === 'YEARLY' ? 'per year' : 'per month'}) *</label>
                            <input id="loan-rate" type="number" step="0.01" placeholder={form.interestFrequency === 'YEARLY' ? '12' : '2'} className="input" value={form.interestRate} min="0.01" onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()} onChange={e => set('interestRate', e.target.value)} required />
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
                            <div className="flex justify-between items-center mb-1">
                                <label className="label !mb-0">Duration *</label>
                                <div className="flex bg-[var(--bg-main)] border border-[var(--border-color)] rounded-md p-0.5">
                                    <button type="button" onClick={() => set('durationUnit', 'MONTHS')} className={`px-2 py-0.5 text-xs rounded transition-all ${form.durationUnit === 'MONTHS' ? 'bg-blue-600 text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>Mo</button>
                                    <button type="button" onClick={() => set('durationUnit', 'YEARS')} className={`px-2 py-0.5 text-xs rounded transition-all ${form.durationUnit === 'YEARS' ? 'bg-blue-600 text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>Yr</button>
                                </div>
                            </div>
                            <input id="loan-duration" type="number" placeholder={form.durationUnit === 'YEARS' ? '1' : '12'} className="input" value={form.duration} min="1" onKeyDown={(e) => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()} onChange={e => set('duration', e.target.value.replace(/\D/g, ''))} required />
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
                                <div className="flex justify-between"><span className="text-[var(--text-muted)] text-sm">Monthly Interest</span><span className="text-[var(--text-main)] font-medium">{formatCurrency(preview.monthlyInterest)}</span></div>
                                <div className="flex justify-between"><span className="text-[var(--text-muted)] text-sm">Total Interest</span><span className="text-yellow-600 dark:text-yellow-400 font-medium">{formatCurrency(preview.totalInterest)}</span></div>
                                <div className="border-t border-[var(--border-color)] pt-3 flex justify-between"><span className="text-[var(--text-main)] font-semibold">Total Payable</span><span className="text-blue-600 dark:text-blue-400 font-bold text-lg">{formatCurrency(preview.totalAmount)}</span></div>

                                <button
                                    onClick={() => setShowSchedule(!showSchedule)}
                                    className="w-full mt-4 btn-secondary py-2 text-sm">
                                    {showSchedule ? 'Hide Route Map' : 'View Repayment Schedule'}
                                </button>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm text-center py-4">Fill in the form to see the preview</p>
                        )}
                    </div>
                </div>
            </div>

            {showSchedule && schedule && schedule.length > 0 && (
                <div className="card mt-6 overflow-x-auto animate-in fade-in slide-in-from-top-4">
                    <h3 className="font-semibold text-[var(--text-main)] mb-4">Amortization Roadmap</h3>
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-[var(--border-color)] text-[var(--text-muted)]">
                                <th className="pb-3 px-2">Month</th>
                                <th className="pb-3 px-2">Date</th>
                                <th className="pb-3 px-2">Payment</th>
                                <th className="pb-3 px-2">Principal</th>
                                <th className="pb-3 px-2">Interest</th>
                                <th className="pb-3 px-2">Remaining</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedule.map((row) => (
                                <tr key={row.month} className="border-b border-[var(--border-color)] hover:bg-[var(--nav-hover)] transition-colors">
                                    <td className="py-3 px-2 font-medium text-[var(--text-main)]">{row.month}</td>
                                    <td className="py-3 px-2 text-[var(--text-muted)]">{new Date(row.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</td>
                                    <td className="py-3 px-2 font-semibold text-blue-600 dark:text-blue-400">{formatCurrency(row.payment)}</td>
                                    <td className="py-3 px-2 text-[var(--text-main)]">{formatCurrency(row.principalPaid)}</td>
                                    <td className="py-3 px-2 text-yellow-600 dark:text-yellow-500">{formatCurrency(row.interestPaid)}</td>
                                    <td className="py-3 px-2 font-medium text-[var(--text-main)]">{formatCurrency(row.remainingBalance)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
