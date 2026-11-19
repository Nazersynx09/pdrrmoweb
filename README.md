This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Admin access

Admin pages and admin APIs require a signed-in Supabase user whose email is listed in the server-only `ADMIN_ALLOWED_EMAILS` environment variable. Admin pages verify a short-lived HttpOnly session cookie on the server before rendering, and admin APIs independently verify the user's access token. Set `ADMIN_ALLOWED_EMAILS` to a comma-separated list of approved email addresses in `.env.local` for development and in the VPS environment for deployment. If it is unset or empty, admin access is denied. The sign-in page remains public so authorized staff can log in; signing in with a non-allowlisted account does not grant admin access.

On deployed environments, `proxy.ts` also hides `/login`, `/admin`, and `/api/admin` from unapproved IPs. Set `ADMIN_ALLOWED_IPS` to a comma-separated list of approved public IP addresses in the VPS environment. If it is unset or empty, these routes return 404 in production; local development is not IP-restricted. The VPS reverse proxy must overwrite `X-Real-IP` with the actual client IP, and the Next.js origin should not be publicly reachable directly. Keep Supabase authentication and the email allowlist enabled as additional protections.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
