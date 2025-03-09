import { auth } from '@clerk/nextjs/server';
import { google } from 'googleapis';
import { createClerkClient } from '@clerk/backend';
import { protectedProcedure, createTRPCRouter } from '../trpc';

const clerk = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY!
});

declare module '@clerk/backend' {
    interface ExternalAccount {
        accessToken?: string;
        token?: string;
    }
}

export const meetingRouter = createTRPCRouter({
    createMeeting: protectedProcedure.mutation(async () => {
        const user = auth();
        const userId = (await user).userId

        if (!userId) {
            throw new Error('Unauthorized');
        }

        const clerkUser = await clerk.users.getUser(userId);
        const googleAccount = clerkUser.externalAccounts.find(
            (ea) => ea.provider === 'oauth_google'
        );

        if (!googleAccount?.accessToken) {
            throw new Error('Google account not connected');
        }

        const calendar = google.calendar({
            version: 'v3',
            auth: googleAccount.accessToken,
        });

        const event = {
            summary: 'Instant Meeting',
            start: {
                dateTime: new Date().toISOString(),
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            end: {
                dateTime: new Date(Date.now() + 3600000).toISOString(),
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            conferenceData: {
                createRequest: {
                    requestId: Math.random().toString(36).slice(2),
                    conferenceSolutionKey: { type: 'hangoutsMeet' },
                },
            },
        };

        try {
            const { data } = await calendar.events.insert({
                calendarId: 'primary',
                requestBody: event,
                conferenceDataVersion: 1,
            });

            return { meetLink: data.hangoutLink! };
        } catch (error) {
            console.error('Google API error:', error);
            throw new Error('Failed to create meeting');
        }
    }),
});