import { IronSessionOptions } from 'iron-session';
import { withIronSessionApiRoute } from 'iron-session/next';

declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      userId: string;
    };
  }
}

const cookieOptions: IronSessionOptions = {
  cookieName: 'polarScript',
  password: process.env.SESSION_KEY!,
  cookieOptions: {
    maxAge: undefined,
    secure: false,
  },
};

export default function withSession(func: any) {
  return withIronSessionApiRoute(func, cookieOptions);
}
