import { useEffect, useState } from 'react';
import { paymentAPI, loanAPI } from '../services/api';
import { CreditCard } from 'lucide-react';

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

export default function Payments() {
    const [loans, setLoans] = useState([]);
    const [allPayments, setAllPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loanAPI.getAll().then(async (r) => {
            setLoans(r.data.data);
            const paymentsList = await Promise.all(
                r.data.data.map(l => paymentAPI.getByLoan(l._id).then(p => p.data.data.map(pay => ({ ...pay, loan: l }))))
            );
            setAllPayments(paymentsList.flat().sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)));
        }).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" /></div>;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-[var(--text-main)]">All Payments</h2>
                <p className="text-[var(--text-muted)] text-sm">{allPayments.length} payment record{allPayments.length !== 1 ? 's' : ''}</p>
            </div>

            {allPayments.length === 0 ? (
                <div className="card text-center py-12">
                    <CreditCard className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No payments recorded yet</p>
                    <p className="text-gray-500 text-sm mt-1">Open a loan to record the first payment</p>
                </div>
            ) : (
                <div className="card space-y-3">
                    {allPayments.map(p => (
                        <div key={p._id} className="flex items-center justify-between p-4 bg-[var(--nav-hover)] rounded-xl border border-[var(--border-color)]">
                            <div className="flex items-center gap-4">
                                <div className="w-9 h-9 bg-green-500/10 rounded-xl flex items-center justify-center">
                                    <CreditCard size={16} className="text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="font-semibold text-[var(--text-main)]">{fmt(p.amount)}</p>
                                    <p className="text-xs text-[var(--text-muted)]">{p.loan?.customerId?.name || '—'} · {p.paymentMethod}</p>
                                    {p.notes && <p className="text-xs text-[var(--text-muted)]">{p.notes}</p>}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-[var(--text-muted)]">{new Date(p.paymentDate).toLocaleDateString('en-IN')}</p>
                                <p className="text-xs text-[var(--text-muted)]">{p.loan?.loanType}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
