import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-line rounded-lg shadow-lg px-3 py-2">
      <div className="text-xs font-semibold text-ink">{label}</div>
      <div className="text-sm font-bold text-brand-600 mt-0.5">
        {payload[0].value} requests
      </div>
    </div>
  );
};

export default function MonthChart({ data = [] }) {
  if (!data.length) {
    return (
      <div className="h-56 flex items-center justify-center text-sm text-muted">
        No data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={230}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e8e1d6" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: '#6b7280' }}
          axisLine={{ stroke: '#e8e1d6' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#e85d75"
          strokeWidth={2.5}
          dot={{ fill: '#e85d75', r: 4, strokeWidth: 2, stroke: '#fff' }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}