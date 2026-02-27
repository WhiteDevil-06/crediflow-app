import { useEffect, useState } from 'react';
import { dashboardAPI } from '../services/api';
import DashboardCard from '../components/DashboardCard';
import { Link } from 'react-router-dom';
import {
    TrendingUp, TrendingDown, DollarSign, AlertTriangle,
    Clock, CheckCircle, Users, Plus
} from 'lucide-react';

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        dashboardAPI.getSummary()
            .then(res => setData(res.data.data))
            .catch(() => setError('Failed to load dashboard'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" /></div>;
    if (error) return <div className="card text-red-400 text-center">{error}</div>;

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <DashboardCard title="Total Lent" value={fmt(data?.totalLent)} icon={TrendingUp} color="green" subtitle="Money given out" />
                <DashboardCard title="Total Borrowed" value={fmt(data?.totalBorrowed)} icon={TrendingDown} color="orange" subtitle="Money taken in" />
                <DashboardCard title="Interest Earned" value={fmt(data?.totalInterestEarned)} icon={DollarSign} color="blue" subtitle="From completed loans" />
                <DashboardCard title="Outstanding" value={fmt(data?.totalOutstanding)} icon={AlertTriangle} color="red" subtitle="Still to collect" />
            </div>

            {/* Status Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <DashboardCard title="Total Loans" value={data?.totalLoans || 0} icon={CheckCircle} color="purple" />
                <DashboardCard title="Active Loans" value={data?.activeLoans || 0} icon={Clock} color="blue" />
                <DashboardCard title="Overdue Loans" value={data?.overdueCount || 0} icon={AlertTriangle} color="red" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Overdue */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-[var(--text-main)] flex items-center gap-2">
                            <AlertTriangle size={16} className="text-red-500" /> Overdue Loans
                        </h2>
                    </div>
                    {data?.overduePayments?.length === 0 ? (
                        <p className="text-gray-500 text-sm text-center py-4">🎉 No overdue loans</p>
                    ) : (
                        <div className="space-y-3">
                            {data?.overduePayments?.slice(0, 5).map(loan => (
                                <Link key={loan._id} to={`/loans/${loan._id}`} className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/20 rounded-xl hover:border-red-500/40 transition-all">
                                    <div>
                                        <p className="text-sm font-medium text-[var(--text-main)]">{loan.customerId?.name}</p>
                                        <p className="text-xs text-[var(--text-muted)]">{fmt(loan.remainingBalance)} remaining</p>
                                    </div>
                                    <span className="badge-overdue">OVERDUE</span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Transactions */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-[var(--text-main)]">Recent Payments</h2>
                        <Link to="/payments" className="text-xs text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity">View all</Link>
                    </div>
                    {data?.recentTransactions?.length === 0 ? (
                        <p className="text-gray-500 text-sm text-center py-4">No payments yet</p>
                    ) : (
                        <div className="space-y-3">
                            {data?.recentTransactions?.map(p => (
                                <div key={p._id} className="flex items-center justify-between p-3 bg-[var(--nav-hover)] rounded-xl">
                                    <div>
                                        <p className="text-sm font-medium text-[var(--text-main)]">{fmt(p.amount)}</p>
                                        <p className="text-xs text-[var(--text-muted)]">{p.paymentMethod} · {new Date(p.paymentDate).toLocaleDateString('en-IN')}</p>
                                    </div>
                                    <span className="text-green-400 text-sm font-semibold">+{fmt(p.amount)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
                <h2 className="font-semibold text-[var(--text-main)] mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-3">
                    <Link to="/customers/add" id="add-customer-btn" className="btn-primary flex items-center gap-2">
                        <Plus size={16} /> Add Customer
                    </Link>
                    <Link to="/loans/add" id="add-loan-btn" className="btn-secondary flex items-center gap-2">
                        <Plus size={16} /> New Loan
                    </Link>
                    <Link to="/calculator" className="btn-secondary flex items-center gap-2">
                        <Users size={16} /> Calculator
                    </Link>
                </div>
            </div>
        </div>
    );
}
