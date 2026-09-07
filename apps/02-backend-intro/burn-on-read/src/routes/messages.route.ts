import { type Request, type Response, Router } from 'express';
import {
  createUUID,
  deleteMessage,
  messageExists,
  readMessage,
  sanitizeMessage,
  storeMessage,
} from '../utils/utils.ts';

const messages: Router = Router();

messages.get('/', (_req: Request, res: Response) => {
  res.render('messages.njk', { title: 'Write a message' });
});

messages.post('/', async (req: Request, res: Response) => {
  const cleanMessage = sanitizeMessage(req.body['secret-message']);
  const messageId = createUUID();

  await storeMessage(messageId, cleanMessage);
  const messageLink = `${req.protocol}://${req.get('host')}${req.baseUrl}/${messageId}`;

  res.render('generate-message-link.njk', {
    title: 'Your secret message link',
    link: messageLink,
  });
});

messages.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const exists = await messageExists(req.params.id);

  if (!exists) {
    return res.render('message-missing.njk', { title: 'Message not found' });
  }

  return res.render('confirm-reveal.njk', {
    title: 'Reveal secret message',
    id: req.params.id,
  });
});

messages.post(
  '/:id/reveal',
  async (req: Request<{ id: string }>, res: Response) => {
    const message = await readMessage(req.params.id);

    if (message === null) {
      return res.render('message-missing.njk', { title: 'Message not found' });
    }

    await deleteMessage(req.params.id);

    return res.render('show-secret-message.njk', {
      title: 'Your received message',
      message,
    });
  },
);

export default messages;
