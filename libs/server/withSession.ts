import { IronSessionOptions } from 'iron-session';
import { withIronSessionApiRoute } from 'iron-session/next';

declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

const cookieOptions: IronSessionOptions = {
  cookieName: 'polarScript',
  password: process.env.SESSION_KEY!,
};

export default function withSession(func: any) {
  return withIronSessionApiRoute(func, cookieOptions);
}
