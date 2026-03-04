import { useEffect, useState, useRef } from 'react';
import { paymentAPI, loanAPI } from '../services/api';
import { CreditCard, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ReceiptTemplate from '../components/ReceiptTemplate';
import { generatePDF } from '../utils/pdfGenerator';

export default function Payments() {
    const { formatCurrency } = useAuth();
    const [loans, setLoans] = useState([]);
    const [allPayments, setAllPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const receiptRef = useRef(null);
    const [activeReceipt, setActiveReceipt] = useState(null);

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

    const handleDownload = async (payment) => {
        setActiveReceipt({
            payment,
            customerName: payment.loan?.customerId?.name || 'Unknown Customer',
            loanType: payment.loan?.loanType || 'GIVEN'
        });

        // Wait for React to apply the activeReceipt state to the hidden div
        setTimeout(() => {
            const dateStr = new Date(payment.paymentDate).toLocaleDateString('en-GB').replace(/\//g, '-');
            generatePDF(receiptRef, `CrediFlow_Receipt_${dateStr}.pdf`);
        }, 100);
    };

    return (
        <div className="space-y-6 relative overflow-hidden">
            {/* Hidden export template layer */}
            <div className="absolute top-[-9999px] left-[-9999px] invisible opacity-0 pointer-events-none">
                <ReceiptTemplate ref={receiptRef} receiptData={activeReceipt} formatCurrency={formatCurrency} />
            </div>
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
                                    <p className="font-semibold text-[var(--text-main)]">{formatCurrency(p.amount)}</p>
                                    <p className="text-xs text-[var(--text-muted)]">{p.loan?.customerId?.name || '—'} · {p.paymentMethod}</p>
                                    {p.notes && <p className="text-xs text-[var(--text-muted)]">{p.notes}</p>}
                                </div>
                            </div>
                            <div className="text-right flex flex-col items-end gap-2">
                                <div>
                                    <p className="text-sm text-[var(--text-muted)]">{new Date(p.paymentDate).toLocaleDateString('en-IN')}</p>
                                    <p className="text-xs text-[var(--text-muted)] truncate">{p.loan?.loanType}</p>
                                </div>
                                <button
                                    className="p-1.5 text-blue-500 hover:text-blue-600 bg-blue-500/10 hover:bg-blue-500/20 rounded border border-blue-500/20 transition-all flex items-center justify-center"
                                    onClick={() => handleDownload(p)}
                                    title="Download PDF Receipt"
                                >
                                    <Download size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
