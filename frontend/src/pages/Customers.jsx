import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { customerAPI } from '../services/api';
import { Plus, Search, Phone, MapPin, Trash2, Eye } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [confirmDelete, setConfirmDelete] = useState(null);

    useEffect(() => {
        customerAPI.getAll().then(r => setCustomers(r.data.data)).finally(() => setLoading(false));
    }, []);

    const handleDelete = async () => {
        if (!confirmDelete) return;
        try {
            await customerAPI.remove(confirmDelete);
            setCustomers(cs => cs.filter(c => c._id !== confirmDelete));
            toast.success('Customer deleted');
        } catch (error) {
            toast.error('Failed to delete customer');
        } finally {
            setConfirmDelete(null);
        }
    };

    const filtered = customers.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone?.includes(search)
    );

    if (loading) return (
        <div className="space-y-6">
            <div className="flex items-center justify-between"><div className="w-32 h-8 skeleton"></div><div className="w-32 h-10 skeleton"></div></div>
            <div className="w-full h-10 skeleton"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="card h-32 skeleton border-transparent"></div>)}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <ConfirmModal
                isOpen={!!confirmDelete}
                title="Delete Customer"
                message="Are you sure you want to delete this customer? This action cannot be undone."
                onConfirm={handleDelete}
                onCancel={() => setConfirmDelete(null)}
                confirmText="Delete"
            />

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-[var(--text-main)]">Customers</h2>
                    <p className="text-[var(--text-muted)] text-sm">{customers.length} customer{customers.length !== 1 ? 's' : ''}</p>
                </div>
                <Link to="/customers/add" id="new-customer-btn" className="btn-primary flex items-center gap-2">
                    <Plus size={16} /> Add Customer
                </Link>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                    type="text"
                    placeholder="Search by name or phone..."
                    className="input pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* List */}
            {filtered.length === 0 ? (
                <div className="card text-center py-12">
                    <p className="text-gray-400 mb-4">{search ? 'No customers match your search' : 'No customers yet'}</p>
                    {!search && <Link to="/customers/add" className="btn-primary inline-flex items-center gap-2"><Plus size={16} /> Add First Customer</Link>}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map(c => (
                        <div key={c._id} className="card hover:border-blue-500/50 transition-all">
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-400 font-bold text-lg">
                                    {c.name[0].toUpperCase()}
                                </div>
                                <div className="flex gap-2">
                                    <Link to={`/customers/${c._id}`} className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all">
                                        <Eye size={15} />
                                    </Link>
                                    <button onClick={() => setConfirmDelete(c._id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                            <h3 className="font-semibold text-[var(--text-main)] truncate" title={c.name}>{c.name}</h3>
                            {c.phone && <p className="text-sm text-[var(--text-muted)] flex items-center gap-1.5 mt-1 overflow-hidden" title={c.phone}><Phone size={12} className="shrink-0" /><span className="truncate">{c.phone}</span></p>}
                            {c.address && <p className="text-sm text-[var(--text-muted)] flex items-center gap-1.5 mt-1 overflow-hidden" title={c.address}><MapPin size={12} className="shrink-0" /><span className="truncate">{c.address}</span></p>}
                            {c.notes && <p className="text-xs text-[var(--text-muted)] mt-2 line-clamp-2 break-words" title={c.notes}>{c.notes}</p>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
