import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { customerAPI } from '../services/api';
import { Plus, Search, Phone, MapPin, Trash2, Eye } from 'lucide-react';

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        customerAPI.getAll().then(r => setCustomers(r.data.data)).finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this customer?')) return;
        await customerAPI.remove(id);
        setCustomers(cs => cs.filter(c => c._id !== id));
    };

    const filtered = customers.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone?.includes(search)
    );

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" /></div>;

    return (
        <div className="space-y-6">
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
                                    <button onClick={() => handleDelete(c._id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{c.name}</h3>
                            {c.phone && <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-1"><Phone size={12} />{c.phone}</p>}
                            {c.address && <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-1"><MapPin size={12} />{c.address}</p>}
                            {c.notes && <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 line-clamp-2">{c.notes}</p>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
