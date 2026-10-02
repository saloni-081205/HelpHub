import {
  Check, Circle, Clock, UserCheck, Loader2, CheckCircle2, XCircle,
} from 'lucide-react';

/**
 * Vertical timeline for a help request.
 * Derives steps from request timestamps + status.
 */
export default function StatusTimeline({ request }) {
  const created = request?.createdAt;
  const acceptedAt = request?.acceptedAt;
  const completedAt = request?.completedAt;
  const cancelledAt = request?.cancelledAt;

  const isCancelled = request?.status === 'Cancelled';

  // Step state resolver
  const stepState = (reached, active) => {
    if (reached) return 'done';
    if (active) return 'current';
    return 'future';
  };

  const steps = [
    {
      key: 'created',
      label: 'Request Created',
      description: 'Your request was posted successfully.',
      time: created,
      icon: Clock,
      state: stepState(true, false), // always done
    },
    {
      key: 'accepted',
      label: 'Volunteer Assigned',
      description: request?.volunteerId
        ? `${request.volunteerId.firstName} ${request.volunteerId.lastName} accepted your request.`
        : 'Waiting for a volunteer to accept.',
      time: acceptedAt,
      icon: UserCheck,
      state: isCancelled
        ? 'future'
        : stepState(!!acceptedAt, request?.status === 'Pending'),
    },
    {
      key: 'inProgress',
      label: 'Assistance in Progress',
      description: 'The volunteer is working on your request.',
      time: null,
      icon: Loader2,
      state: isCancelled
        ? 'future'
        : stepState(
            request?.status === 'In Progress' || request?.status === 'Completed',
            request?.status === 'Accepted'
          ),
    },
    {
      key: 'completed',
      label: 'Assistance Completed',
      description: 'The request has been fulfilled.',
      time: completedAt,
      icon: CheckCircle2,
      state: isCancelled
        ? 'future'
        : stepState(request?.status === 'Completed', request?.status === 'In Progress'),
    },
  ];

  const cancelledStep = isCancelled
    ? {
        key: 'cancelled',
        label: 'Request Cancelled',
        description: 'This request was cancelled.',
        time: cancelledAt,
        icon: XCircle,
        state: 'cancelled',
      }
    : null;

  const allSteps = cancelledStep ? [...steps.slice(0, 1), cancelledStep] : steps;

  const fmt = (d) =>
    d
      ? new Date(d).toLocaleString(undefined, {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        })
      : null;

  const dotClasses = {
    done: 'bg-teal-600 border-teal-600 text-white',
    current: 'bg-brand-500 border-brand-500 text-white animate-pulse',
    future: 'bg-white border-line text-muted',
    cancelled: 'bg-red-500 border-red-500 text-white',
  };

  const labelClasses = {
    done: 'text-ink',
    current: 'text-brand-600',
    future: 'text-muted',
    cancelled: 'text-red-600',
  };

  const lineClasses = {
    done: 'bg-teal-500',
    current: 'bg-brand-300',
    future: 'bg-line',
    cancelled: 'bg-line',
  };

  return (
    <ol className="relative space-y-6">
      {allSteps.map((step, idx) => {
        const Icon = step.icon;
        const isLast = idx === allSteps.length - 1;
        const DotIcon =
          step.state === 'done'
            ? Check
            : step.state === 'cancelled'
            ? XCircle
            : step.state === 'current'
            ? Icon
            : Circle;

        return (
          <li key={step.key} className="relative pl-12">
            {/* Connector line */}
            {!isLast && (
              <span
                className={`absolute left-[19px] top-10 bottom-[-24px] w-0.5 ${lineClasses[step.state]}`}
                aria-hidden="true"
              />
            )}

            {/* Dot */}
            <span
              className={`absolute left-0 top-0 w-10 h-10 rounded-full border-2 flex items-center justify-center ${dotClasses[step.state]}`}
            >
              <DotIcon size={16} strokeWidth={2.5} />
            </span>

            {/* Content */}
            <div className="min-h-[40px]">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h4 className={`font-bold text-sm sm:text-base ${labelClasses[step.state]}`}>
                  {step.label}
                </h4>
                {step.state === 'current' && (
                  <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-brand-100 text-brand-700">
                    In progress
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-muted mt-0.5">{step.description}</p>
              {step.time && (
                <p className="text-[11px] text-muted/80 mt-1 italic">
                  {fmt(step.time)}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}