import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { customerAPI, loanAPI } from '../services/api';
import { ArrowLeft, Phone, MapPin, Edit, TrendingUp } from 'lucide-react';

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
const statusBadge = (s) => {
    if (s === 'ACTIVE') return <span className="badge-active">ACTIVE</span>;
    if (s === 'OVERDUE') return <span className="badge-overdue">OVERDUE</span>;
    return <span className="badge-completed">COMPLETED</span>;
};

export default function CustomerDetails() {
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([customerAPI.getOne(id), loanAPI.getAll()])
            .then(([cRes, lRes]) => {
                setCustomer(cRes.data.data);
                setLoans(lRes.data.data.filter(l => l.customerId?._id === id));
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" /></div>;
    if (!customer) return <div className="card text-center text-gray-400">Customer not found</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link to="/customers" className="p-2 bg-[var(--nav-hover)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] transition-all">
                    <ArrowLeft size={18} />
                </Link>
                <h2 className="text-xl font-bold text-[var(--text-main)]">Customer Details</h2>
            </div>

            <div className="card">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-2xl">
                            {customer.name[0].toUpperCase()}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[var(--text-main)]">{customer.name}</h3>
                            {customer.phone && <p className="text-[var(--text-muted)] text-sm flex items-center gap-1 mt-1"><Phone size={12} />{customer.phone}</p>}
                            {customer.address && <p className="text-[var(--text-muted)] text-sm flex items-center gap-1"><MapPin size={12} />{customer.address}</p>}
                        </div>
                    </div>
                    <Link to={`/customers/${id}/edit`} className="btn-secondary flex items-center gap-2 text-sm"><Edit size={14} />Edit</Link>
                </div>
                {customer.notes && <p className="mt-4 text-sm text-[var(--text-muted)] bg-[var(--nav-hover)] rounded-xl p-3 border border-[var(--border-color)]">{customer.notes}</p>}
            </div>

            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-[var(--text-main)] flex items-center gap-2">
                        <TrendingUp size={16} className="text-blue-500 dark:text-blue-400" /> Loans ({loans.length})
                    </h3>
                    <Link to={`/loans/add?customerId=${id}`} className="btn-primary text-sm px-3 py-2">+ New Loan</Link>
                </div>
                {loans.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-6">No loans for this customer</p>
                ) : (
                    <div className="space-y-3">
                        {loans.map(loan => (
                            <Link key={loan._id} to={`/loans/${loan._id}`} className="flex items-center justify-between p-4 bg-[var(--nav-hover)] rounded-xl hover:border-blue-500/30 border border-[var(--border-color)] transition-all">
                                <div>
                                    <p className="font-medium text-[var(--text-main)]">{fmt(loan.principalAmount)} <span className={`text-xs ml-1 ${loan.loanType === 'GIVEN' ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-600 dark:text-orange-400'}`}>{loan.loanType}</span></p>
                                    <p className="text-sm text-[var(--text-muted)]">{loan.interestRate}% {loan.interestFrequency} · {loan.durationMonths} months</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-[var(--text-muted)] font-medium">{fmt(loan.remainingBalance)} left</p>
                                    {statusBadge(loan.status)}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
