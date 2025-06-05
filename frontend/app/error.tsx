'use client';

import { useEffect } from 'react';

export default function Error({
    children,
}: {
    children: React.ReactNode;
}) {
    useEffect(() => {
        // Log errors to your error tracking service
        const handleError = (error: ErrorEvent) => {
            console.error('Error caught by error boundary:', error);
            // Add your error tracking service here (e.g., Sentry)
        };

        window.addEventListener('error', handleError);
        return () => window.removeEventListener('error', handleError);
    }, []);

    return (
        <div className="relative">
            {children}
        </div>
    );
} 