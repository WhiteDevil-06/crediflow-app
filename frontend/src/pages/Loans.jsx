import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { loanAPI } from '../services/api';
import { Plus, Filter } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Loans() {
    const { formatCurrency } = useAuth();
    const [loans, setLoans] = useState([]);
    const [filter, setFilter] = useState('ALL');
    const [loading, setLoading] = useState(true);
    const [confirmDelete, setConfirmDelete] = useState(null);

    useEffect(() => {
        loanAPI.getAll().then(r => setLoans(r.data.data)).finally(() => setLoading(false));
    }, []);

    const handleDelete = async () => {
        if (!confirmDelete) return;
        try {
            await loanAPI.remove(confirmDelete);
            setLoans(ls => ls.filter(l => l._id !== confirmDelete));
            toast.success('Loan deleted');
        } catch (error) {
            toast.error('Failed to delete loan');
        } finally {
            setConfirmDelete(null);
        }
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

    if (loading) return (
        <div className="space-y-6">
            <div className="flex items-center justify-between"><div className="w-32 h-8 skeleton"></div><div className="w-32 h-10 skeleton"></div></div>
            <div className="flex gap-2"><div className="w-16 h-8 skeleton"></div><div className="w-16 h-8 skeleton"></div></div>
            <div className="space-y-3">
                {[1, 2, 3, 4].map(i => <div key={i} className="card h-20 skeleton border-transparent"></div>)}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <ConfirmModal
                isOpen={!!confirmDelete}
                title="Delete Loan"
                message="Are you sure you want to delete this loan? This action cannot be undone."
                onConfirm={handleDelete}
                onCancel={() => setConfirmDelete(null)}
                confirmText="Delete"
            />

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
                                <p className="font-bold text-[var(--text-main)]">{formatCurrency(loan.principalAmount)}</p>
                                <p className="text-xs text-[var(--text-muted)] mt-1 mb-2">{formatCurrency(loan.remainingBalance)} remaining</p>
                                <div className="flex items-center justify-end gap-2">
                                    <StatusBadge s={loan.status} />
                                    <button onClick={(e) => { e.preventDefault(); setConfirmDelete(loan._id); }} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all border border-transparent hover:border-red-500/20">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
