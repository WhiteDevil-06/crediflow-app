export default function DashboardCard({ title, value, icon: Icon, color = 'blue', subtitle }) {
    const colors = {
        blue: 'bg-blue-500/10 text-blue-400',
        green: 'bg-green-500/10 text-green-400',
        red: 'bg-red-500/10 text-red-400',
        orange: 'bg-orange-500/10 text-orange-400',
        purple: 'bg-purple-500/10 text-purple-400',
    };

    return (
        <div className="card hover:border-blue-500/50 transition-all duration-200">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm text-[var(--text-muted)] font-medium">{title}</p>
                    <p className="text-2xl font-bold text-[var(--text-main)] mt-1">{value}</p>
                    {subtitle && <p className="text-xs text-[var(--text-muted)] mt-1">{subtitle}</p>}
                </div>
                <div className={`p-3 rounded-xl ${colors[color]}`}>
                    <Icon size={22} />
                </div>
            </div>
        </div>
    );
}
