import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { customerAPI } from '../services/api';
import { Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AddCustomer() {
    const { id } = useParams();
    const isEdit = !!id;
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', phone: '', address: '', notes: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEdit) {
            customerAPI.getOne(id).then(r => setForm({ name: r.data.data.name, phone: r.data.data.phone || '', address: r.data.data.address || '', notes: r.data.data.notes || '' }));
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isEdit) await customerAPI.update(id, form);
            else await customerAPI.create(form);
            navigate('/customers');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save customer');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link to="/customers" className="p-2 bg-[var(--nav-hover)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] transition-all">
                    <ArrowLeft size={18} />
                </Link>
                <h2 className="text-xl font-bold text-[var(--text-main)]">{isEdit ? 'Edit Customer' : 'Add Customer'}</h2>
            </div>

            <div className="card">
                {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-4 text-sm">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="label">Full Name *</label>
                        <input id="customer-name" type="text" placeholder="Customer name" className="input" value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div>
                        <label className="label">Phone</label>
                        <input id="customer-phone" type="tel" placeholder="+91 9876543210" className="input" value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    </div>
                    <div>
                        <label className="label">Address</label>
                        <input id="customer-address" type="text" placeholder="City, State" className="input" value={form.address}
                            onChange={(e) => setForm({ ...form, address: e.target.value })} />
                    </div>
                    <div>
                        <label className="label">Notes (optional)</label>
                        <textarea id="customer-notes" rows={3} placeholder="Any notes about this customer" className="input resize-none"
                            value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                    </div>
                    <button id="save-customer-btn" type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                        <Save size={16} /> {loading ? 'Saving...' : isEdit ? 'Update Customer' : 'Add Customer'}
                    </button>
                </form>
            </div>
        </div>
    );
}
