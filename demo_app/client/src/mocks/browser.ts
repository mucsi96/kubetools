import { rest, setupWorker } from 'msw';

export const mocks = [
  rest.get('/auth/user-info', (_req, res, ctx) => {
    const isSignedIn = !!sessionStorage.getItem('signedIn');

    if (!isSignedIn) {
      return res(ctx.status(400));
    }

    return res(
      ctx.status(200),
      ctx.json({ name: 'Igor', sub: '123', groups: ['user', 'admin'] })
    );
  }),
  rest.post('/auth/authorize', (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ authorizationUrl: '/signin-redirect-callback' })
    );
  }),
  rest.post('/auth/get-token', (_req, res, ctx) => {
    sessionStorage.setItem('signedIn', 'true');
    return res(ctx.status(200));
  }),
  rest.post('/auth/logout', (_req, res, ctx) => {
    sessionStorage.removeItem('signedIn');
    return res(ctx.status(200));
  }),
  rest.get('/api/message', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ message: 'Test message' }));
  }),
];

const worker = setupWorker(...mocks);
worker.start({ onUnhandledRequest: 'bypass' });

export { worker, rest };
