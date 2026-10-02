import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import CategoryIcon from '../CategoryIcon';

const COLORS = ['#e85d75', '#0f766e', '#f59e0b', '#8b5cf6', '#0ea5e9', '#84cc16', '#94a3b8'];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-line rounded-lg shadow-lg px-3 py-2">
      <div className="flex items-center gap-2 text-xs font-semibold text-ink">
        <CategoryIcon category={payload[0].payload.name} size={12} />
        {payload[0].payload.name}
      </div>
      <div className="text-sm font-bold text-brand-600 mt-0.5">
        {payload[0].value} requests
      </div>
    </div>
  );
};

export default function CategoryChart({ data = [] }) {
  if (!data.length) {
    return (
      <div className="h-56 flex items-center justify-center text-sm text-muted">
        No data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={230}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <XAxis
          dataKey="name"
          tick={{ fontSize: 10, fill: '#6b7280' }}
          interval={0}
          tickFormatter={(v) => v.split(' ')[0]}
          axisLine={{ stroke: '#e8e1d6' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#fdf2f4' }} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}