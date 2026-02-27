import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { loanAPI } from '../services/api';
import { Plus, Filter } from 'lucide-react';

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

export default function Loans() {
    const [loans, setLoans] = useState([]);
    const [filter, setFilter] = useState('ALL');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loanAPI.getAll().then(r => setLoans(r.data.data)).finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this loan?')) return;
        await loanAPI.remove(id);
        setLoans(ls => ls.filter(l => l._id !== id));
    };

    const filtered = filter === 'ALL' ? loans : loans.filter(l =>
        filter === 'OVERDUE' ? l.status === 'OVERDUE' :
            filter === 'ACTIVE' ? l.status === 'ACTIVE' :
                filter === 'COMPLETED' ? l.status === 'COMPLETED' :
                    l.loanType === filter
    );

    const StatusBadge = ({ s }) => {
        if (s === 'ACTIVE') return <span className="badge-active">ACTIVE</span>;
        if (s === 'OVERDUE') return <span className="badge-overdue">OVERDUE</span>;
        return <span className="badge-completed">COMPLETED</span>;
    };

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-[var(--text-main)]">Loans</h2>
                    <p className="text-[var(--text-muted)] text-sm">{loans.length} total loan{loans.length !== 1 ? 's' : ''}</p>
                </div>
                <Link to="/loans/add" id="add-loan-btn" className="btn-primary flex items-center gap-2"><Plus size={16} />New Loan</Link>
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
                {['ALL', 'GIVEN', 'TAKEN', 'ACTIVE', 'OVERDUE', 'COMPLETED'].map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f ? 'bg-blue-600 text-white' : 'bg-[var(--nav-hover)] text-[var(--text-main)] border border-[var(--border-color)] hover:brightness-95'}`}>
                        {f}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="card text-center py-12">
                    <p className="text-gray-400 mb-4">No loans found</p>
                    <Link to="/loans/add" className="btn-primary inline-flex items-center gap-2"><Plus size={16} />Add Loan</Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(loan => (
                        <Link key={loan._id} to={`/loans/${loan._id}`} className="card flex items-center justify-between hover:border-blue-500/50 transition-all cursor-pointer block">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold ${loan.loanType === 'GIVEN' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                    {loan.loanType === 'GIVEN' ? '↑' : '↓'}
                                </div>
                                <div>
                                    <p className="font-semibold text-[var(--text-main)]">{loan.customerId?.name} <span className={`text-xs ml-1 ${loan.loanType === 'GIVEN' ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-600 dark:text-orange-400'}`}>{loan.loanType}</span></p>
                                    <p className="text-sm text-[var(--text-muted)]">{loan.interestRate}% · {loan.interestType} · {loan.durationMonths}m</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-[var(--text-main)]">{fmt(loan.principalAmount)}</p>
                                <p className="text-xs text-[var(--text-muted)]">{fmt(loan.remainingBalance)} remaining</p>
                                <StatusBadge s={loan.status} />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
