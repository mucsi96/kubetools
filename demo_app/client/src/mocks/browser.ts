import { rest, setupWorker } from 'msw';

export const mocks = [
  rest.get('/api/message', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ message: 'Test message' }));
  }),
];

const worker = setupWorker(...mocks);
worker.start({ onUnhandledRequest: 'bypass'});

export { worker, rest };
