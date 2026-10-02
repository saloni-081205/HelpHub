import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell, CheckCheck, Trash2, Inbox, HandHeart, CheckCircle2,
  XCircle, PlayCircle, UserCheck, X,
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

export default function NotificationBell() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteOne,
    clearAll,
  } = useNotifications();

  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  // ---- Close on outside click ----
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('touchstart', onDoc);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('touchstart', onDoc);
    };
  }, [open]);

  // ---- Close on Escape, lock body scroll while open ----
  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onEsc);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onEsc);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const close = () => setOpen(false);

  const handleClick = async (n) => {
    if (!n.isRead) await markAsRead(n._id);
    close();
    if (n.link) navigate(n.link);
  };

  const recent = notifications.slice(0, 8);

  return (
    <div className="relative" ref={wrapRef}>
      {/* ---- Bell button ---- */}
      <button
        ref={buttonRef}
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-full hover:bg-cream active:bg-cream transition-colors"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Bell size={19} className="text-ink/80" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full
                           bg-brand-500 text-white text-[10px] font-bold
                           flex items-center justify-center ring-2 ring-cream">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* ---- Mobile backdrop ---- */}
          <div
            className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-0"
            onClick={close}
            aria-hidden="true"
          />

          {/* ---- Dropdown panel ---- */}
          <div
            role="dialog"
            aria-label="Notifications"
            className="
              fixed z-[70]
              inset-x-3 top-16
              sm:absolute sm:inset-x-auto sm:top-auto sm:right-0 sm:mt-2 sm:w-[26rem]
              lg:w-96
              bg-white rounded-2xl shadow-2xl border border-line
              max-h-[75vh] sm:max-h-[28rem]
              flex flex-col
              overflow-hidden
              animate-[fade-up_0.15s_ease-out_both]
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-line flex-shrink-0">
              <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                <Bell size={14} className="text-brand-500" />
                Notifications
                {unreadCount > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 font-bold">
                    {unreadCount} new
                  </span>
                )}
              </h3>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                  >
                    <CheckCheck size={13} />
                    <span className="hidden xs:inline">Mark all read</span>
                  </button>
                )}
                {/* Close button — visible on mobile only (backdrop covers desktop) */}
                <button
                  onClick={close}
                  className="p-1 rounded-lg hover:bg-cream transition-colors sm:hidden"
                  aria-label="Close notifications"
                >
                  <X size={16} className="text-muted" />
                </button>
              </div>
            </div>

            {/* List (scrollable) */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {recent.length === 0 ? (
                <div className="py-12 text-center">
                  <Inbox size={32} className="text-muted mx-auto mb-2" />
                  <p className="text-sm text-muted">No notifications yet</p>
                </div>
              ) : (
                recent.map((n) => {
                  const Icon = iconByType[n.type] || Bell;
                  return (
                    <div
                      key={n._id}
                      className={`group flex items-start gap-3 px-4 py-3 border-b border-line last:border-b-0
                                  hover:bg-cream transition-colors cursor-pointer ${
                                    !n.isRead ? 'bg-brand-50/40' : ''
                                  }`}
                      onClick={() => handleClick(n)}
                    >
                      <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
                        !n.isRead ? 'bg-brand-100 text-brand-700' : 'bg-cream text-muted'
                      }`}>
                        <Icon size={15} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs sm:text-sm leading-snug ${
                          !n.isRead ? 'font-semibold text-ink' : 'text-ink/80'
                        }`}>
                          {n.message}
                        </p>
                        <p className="text-[10px] text-muted mt-1">{timeAgo(n.createdAt)}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteOne(n._id);
                        }}
                        className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 rounded
                                   hover:bg-brand-50 text-muted hover:text-brand-600 transition-all
                                   flex-shrink-0"
                        aria-label="Delete notification"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-line bg-cream/50 flex-shrink-0">
              <Link
                to="/notifications"
                onClick={close}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700"
              >
                View all
              </Link>
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-xs font-semibold text-muted hover:text-red-600 flex items-center gap-1"
                >
                  <Trash2 size={12} /> Clear all
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}