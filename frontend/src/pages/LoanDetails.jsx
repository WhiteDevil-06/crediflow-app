import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { loanAPI, paymentAPI } from '../services/api';
import { ArrowLeft, FileText, CreditCard, X } from 'lucide-react';

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

function PaymentModal({ loan, onClose, onSuccess }) {
    const [form, setForm] = useState({ amount: '', paymentDate: new Date().toISOString().slice(0, 10), paymentMethod: 'CASH', notes: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await paymentAPI.record({ ...form, loanId: loan._id, amount: Number(form.amount) });
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to record payment');
        } finally { setLoading(false); }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="card w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-[var(--text-main)]">Record Payment</h3>
                    <button onClick={onClose} className="p-1.5 hover:bg-[var(--nav-hover)] rounded-lg text-[var(--text-muted)]"><X size={16} /></button>
                </div>
                {error && <div className="bg-red-500/10 text-red-400 rounded-xl px-3 py-2 mb-3 text-sm">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="label">Amount (₹) *</label>
                        <input id="payment-amount" type="number" placeholder={`Max: ${fmt(loan.remainingBalance)}`} className="input"
                            value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="label">Date</label>
                            <input type="date" className="input" value={form.paymentDate} onChange={e => setForm({ ...form, paymentDate: e.target.value })} />
                        </div>
                        <div>
                            <label className="label">Method</label>
                            <select className="input" value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })}>
                                {['CASH', 'UPI', 'BANK_TRANSFER', 'CHEQUE', 'OTHER'].map(m => <option key={m}>{m}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="label">Note</label>
                        <input type="text" placeholder="Reference or note" className="input" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                    </div>
                    <button id="confirm-payment-btn" type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Recording...' : 'Record Payment'}</button>
                </form>
            </div>
        </div>
    );
}

export default function LoanDetails() {
    const { id } = useParams();
    const [loan, setLoan] = useState(null);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const fetchData = async () => {
        const [lRes, pRes] = await Promise.all([loanAPI.getOne(id), paymentAPI.getByLoan(id)]);
        setLoan(lRes.data.data);
        setPayments(pRes.data.data);
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, [id]);

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" /></div>;
    if (!loan) return <div className="card text-center text-gray-400">Loan not found</div>;

    const pct = Math.max(0, Math.min(100, ((loan.totalAmount - loan.remainingBalance) / loan.totalAmount) * 100));

    return (
        <div className="space-y-6">
            {showModal && <PaymentModal loan={loan} onClose={() => setShowModal(false)} onSuccess={() => { setShowModal(false); fetchData(); }} />}

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/loans" className="p-2 bg-[var(--nav-hover)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] transition-all">
                        <ArrowLeft size={18} />
                    </Link>
                    <h2 className="text-xl font-bold text-[var(--text-main)]">Loan Details</h2>
                </div>
                {loan.status !== 'COMPLETED' && (
                    <button id="record-payment-btn" onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2"><CreditCard size={16} />Record Payment</button>
                )}
            </div>

            <div className="card">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-[var(--text-muted)] text-sm">Customer</p>
                        <h3 className="text-lg font-bold text-[var(--text-main)]">{loan.customerId?.name}</h3>
                        {loan.customerId?.phone && <p className="text-[var(--text-muted)] text-sm">{loan.customerId.phone}</p>}
                    </div>
                    <div className="text-right">
                        {loan.loanType === 'GIVEN' ? <span className="badge-given">GIVEN</span> : <span className="badge-taken">TAKEN</span>}
                        <div className="mt-1">
                            {loan.status === 'ACTIVE' && <span className="badge-active">ACTIVE</span>}
                            {loan.status === 'OVERDUE' && <span className="badge-overdue">OVERDUE</span>}
                            {loan.status === 'COMPLETED' && <span className="badge-completed">COMPLETED</span>}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {[
                        ['Principal', fmt(loan.principalAmount)],
                        ['Interest Rate', `${loan.interestRate}% ${loan.interestFrequency}`],
                        ['Total Interest', fmt(loan.totalInterest)],
                        ['Total Amount', fmt(loan.totalAmount)],
                        ['Monthly Interest', fmt(loan.monthlyInterest)],
                        ['Duration', `${loan.durationMonths} months`],
                        ['Start Date', new Date(loan.startDate).toLocaleDateString('en-IN')],
                        ['Remaining', fmt(loan.remainingBalance)],
                    ].map(([k, v]) => (
                        <div key={k} className="bg-[var(--nav-hover)] rounded-xl p-3 border border-[var(--border-color)]">
                            <p className="text-xs text-[var(--text-muted)]">{k}</p>
                            <p className="font-semibold text-[var(--text-main)] mt-0.5">{v}</p>
                        </div>
                    ))}
                </div>

                {/* Progress bar */}
                <div>
                    <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1">
                        <span>Repayment progress</span><span>{pct.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-[var(--nav-hover)] rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                </div>

                {loan.documentUrl && (
                    <a href={loan.documentUrl} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300">
                        <FileText size={14} /> View Document
                    </a>
                )}
            </div>

            {/* Payment History */}
            <div className="card">
                <h3 className="font-semibold text-[var(--text-main)] mb-4">Payment History ({payments.length})</h3>
                {payments.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">No payments recorded yet</p>
                ) : (
                    <div className="space-y-2">
                        {payments.map(p => (
                            <div key={p._id} className="flex items-center justify-between p-3 bg-[var(--nav-hover)] rounded-xl border border-[var(--border-color)]">
                                <div>
                                    <p className="font-medium text-[var(--text-main)]">{fmt(p.amount)}</p>
                                    <p className="text-xs text-[var(--text-muted)]">{p.paymentMethod} · {p.notes}</p>
                                </div>
                                <p className="text-sm text-[var(--text-muted)]">{new Date(p.paymentDate).toLocaleDateString('en-IN')}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
