import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: "https://ep-tiny-sky-af6cv7wl.neonauth.c-2.us-west-2.aws.neon.tech/neondb/auth"
})

export const { signIn, signUp, signOut, useSession } = authClient;
