import { rest, setupWorker } from 'msw';

export const mocks = [
  rest.get('/api/message', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json('Test message'));
  }),
];

const worker = setupWorker(...mocks);
worker.start();

export { worker, rest };
