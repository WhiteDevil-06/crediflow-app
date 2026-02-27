import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { Zap, Eye, EyeOff } from 'lucide-react';
import Footer from '../components/Footer';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await authAPI.login(form);
            login(res.data.user, res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-main)] flex flex-col transition-colors duration-200">
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4">
                            <Zap className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-[var(--text-main)]">Welcome back</h1>
                        <p className="text-[var(--text-muted)] mt-1">Sign in to CrediFlow</p>
                    </div>

                    <div className="card">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-4 text-sm">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="label">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    className="input"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="label">Password</label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPass ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        className="input pr-10"
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        required
                                    />
                                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            <button id="login-btn" type="submit" disabled={loading} className="btn-primary w-full mt-2">
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>
                        <p className="text-center text-sm text-[var(--text-muted)] mt-4">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-blue-600 dark:text-blue-400 font-semibold transition-colors">Create one</Link>
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
