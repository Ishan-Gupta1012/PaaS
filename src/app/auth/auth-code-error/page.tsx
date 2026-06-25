import Link from 'next/link';

export default function AuthError() {
  return (
    <div className="w-full flex-1 min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md min-w-[320px] sm:min-w-[400px] shrink-0 bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-danger-100 text-danger-600 mb-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mb-2">
          Authentication Error
        </h1>
        <p className="text-neutral-500 mb-6">
          There was a problem authenticating with Supabase. The secure code could not be exchanged. This is usually caused by mismatched Site URLs or missing provider configurations in the dashboard.
        </p>
        <Link 
          href="/signin"
          className="inline-flex h-11 items-center justify-center bg-brand-600 text-white font-semibold rounded-lg px-6 w-full hover:bg-brand-600/90 transition-colors"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
}
