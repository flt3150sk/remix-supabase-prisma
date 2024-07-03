import { createCookieSessionStorage } from "@vercel/remix";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "__session",
      expires: new Date(Date.now() + 3 * 60 * 60), // 3時間
      httpOnly: true,
      maxAge: 3 * 60 * 60, //3時間待
      path: "/",
      sameSite: "lax",
      secrets: [process.env.SESSION_KEY!],
      secure: true,
    },
  });
export { getSession, commitSession, destroySession };
