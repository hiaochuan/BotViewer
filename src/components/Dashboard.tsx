import { Activity, TrendingUp, Users, DollarSign } from 'lucide-react'

function Dashboard() {
    const stats = [
        {
            title: 'Active Users',
            value: '0',
            icon: Users,
            color: 'text-blue-400',
            bgColor: 'bg-blue-900/20',
        },
        {
            title: 'Running Tracks',
            value: '0',
            icon: TrendingUp,
            color: 'text-green-400',
            bgColor: 'bg-green-900/20',
        },
        {
            title: 'Total KOLs',
            value: '0',
            icon: Activity,
            color: 'text-purple-400',
            bgColor: 'bg-purple-900/20',
        },
        {
            title: 'Total Balance',
            value: '$0',
            icon: DollarSign,
            color: 'text-yellow-400',
            bgColor: 'bg-yellow-900/20',
        },
    ]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-100">Dashboard</h1>
                <p className="text-gray-400 mt-2">Overview of your trading bot system</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                                <p className="text-2xl font-bold text-gray-100">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="card p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-100">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="btn-primary">
                        Add New User
                    </button>
                    <button className="btn-primary">
                        Add New KOL
                    </button>
                    <button className="btn-primary">
                        Create Track Config
                    </button>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="card p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-100">Recent Activity</h2>
                <div className="text-gray-400 text-center py-8">
                    No recent activity to display
                </div>
            </div>
        </div>
    )
}

export default Dashboard
