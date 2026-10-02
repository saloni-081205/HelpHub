import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const STATUS_COLORS = {
  Pending: '#f59e0b',
  Accepted: '#0d9488',
  'In Progress': '#e85d75',
  Completed: '#0f766e',
  Cancelled: '#94a3b8',
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-line rounded-lg shadow-lg px-3 py-2">
      <div className="text-xs font-semibold text-ink">{payload[0].name}</div>
      <div className="text-sm font-bold text-brand-600 mt-0.5">
        {payload[0].value} requests
      </div>
    </div>
  );
};

export default function StatusChart({ data = [] }) {
  if (!data.length) {
    return (
      <div className="h-56 flex items-center justify-center text-sm text-muted">
        No data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={230}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={45}
          outerRadius={75}
          paddingAngle={3}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={STATUS_COLORS[entry.name] || '#94a3b8'} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="bottom"
          iconType="circle"
          wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}