import { Link } from 'react-router-dom';
import {
  Bell, CheckCheck, Trash2, Inbox, HandHeart, CheckCircle2,
  XCircle, PlayCircle, UserCheck,
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const iconByType = {
  request_created: Inbox,
  request_accepted: HandHeart,
  request_assigned: UserCheck,
  request_started: PlayCircle,
  request_completed: CheckCircle2,
  request_cancelled: XCircle,
};

function timeAgo(date) {
  const d = new Date(date);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString();
}

export default function Notifications() {
  const {
    notifications, unreadCount, loading,
    markAsRead, markAllAsRead, deleteOne, clearAll,
  } = useNotifications();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-5 py-6 lg:py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-ink flex items-center gap-3">
            <Bell size={28} className="text-brand-500" /> Notifications
          </h1>
          <p className="text-muted text-sm mt-1">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="btn-ghost text-xs">
              <CheckCheck size={14} /> Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-red-300
                         text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors"
            >
              <Trash2 size={13} /> Clear all
            </button>
          )}
        </div>
      </div>

      {loading && notifications.length === 0 ? (
        <div className="card text-center py-10 text-muted text-sm">Loading…</div>
      ) : notifications.length === 0 ? (
        <div className="card text-center py-14">
          <Inbox size={48} className="mx-auto text-brand-300 mb-3" />
          <h3 className="text-lg font-bold text-ink mb-1">No notifications</h3>
          <p className="text-sm text-muted">
            You'll see updates here when volunteers or requesters take action.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const Icon = iconByType[n.type] || Bell;
            return (
              <div
                key={n._id}
                className={`card !p-4 flex items-start gap-3 transition-all ${
                  !n.isRead ? 'border-l-4 !border-l-brand-500' : ''
                }`}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  !n.isRead ? 'bg-brand-100 text-brand-700' : 'bg-cream text-muted'
                }`}>
                  <Icon size={18} />
                </div>

                <div className="flex-1 min-w-0">
                  {n.link ? (
                    <Link
                      to={n.link}
                      onClick={() => !n.isRead && markAsRead(n._id)}
                      className={`block text-sm leading-relaxed hover:text-brand-600 ${
                        !n.isRead ? 'font-semibold text-ink' : 'text-ink/80'
                      }`}
                    >
                      {n.message}
                    </Link>
                  ) : (
                    <p className={`text-sm ${!n.isRead ? 'font-semibold text-ink' : 'text-ink/80'}`}>
                      {n.message}
                    </p>
                  )}
                  <p className="text-xs text-muted mt-1">{timeAgo(n.createdAt)}</p>
                </div>

                <div className="flex flex-col gap-1 flex-shrink-0">
                  {!n.isRead && (
                    <button
                      onClick={() => markAsRead(n._id)}
                      className="p-1.5 rounded-lg text-teal-700 hover:bg-teal-50 transition-colors"
                      title="Mark as read"
                    >
                      <CheckCheck size={15} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteOne(n._id)}
                    className="p-1.5 rounded-lg text-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}