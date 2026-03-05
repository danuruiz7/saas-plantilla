import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Coincide con todas las peticiones excepto api, _next estáticos y ficheros con extensión.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
