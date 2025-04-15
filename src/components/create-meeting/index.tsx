// components/CreateMeetingButton.tsx
'use client'
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { api } from '@/trpc/react';

export const CreateMeetingButton = () => {
    const { user } = useUser();
    const [error, setError] = useState<string | null>(null);

    // tRPC mutation to create meeting
    const { mutate: createMeeting } = api.googleMeet.createMeeting.useMutation({
        onSuccess: (data: any) => {
            navigator.clipboard.writeText(data.meetLink);
            console.log(data.meetLink)
            // toast.success('Meeting link copied to clipboard!');
            setError(null);
        },
        onError: (err: any) => {
            if (err.message.includes('Google account not connected')) {
                setError('google-connection-required');
            } else {
                // toast.error('Failed to create meeting');
            }
        },
    });

    // Connect Google account handler
    const connectGoogleAccount = async () => {
        if (!user) {
            return;
        }
        const value = 'https://www.googleapis.com/auth/calendar'

        try {
            await user.createExternalAccount({
                strategy: 'oauth_google',
                redirectUrl: window.location.href,
                additionalScopes: [value],
            });
        } catch (err) {
            // toast.error('Failed to connect Google account');
        }
    };

    return (
        <div className="flex flex-col gap-2">
            {error === 'google-connection-required' ? (
                <button
                    onClick={connectGoogleAccount}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                    Connect Google Account
                </button>
            ) : (
                <button
                    onClick={() => createMeeting()}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                    Creating Meeting...
                </button>
            )}

            {error && (
                <p className="text-red-500 text-sm mt-1">
                    Please connect your Google account to create meetings
                </p>
            )}
        </div>
    );
};