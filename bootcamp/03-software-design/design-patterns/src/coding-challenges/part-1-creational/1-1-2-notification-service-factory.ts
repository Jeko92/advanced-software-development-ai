/**
 * Challenge 1.1.2 — Notification Service Factory
 * (extra practice rep of the Factory pattern — not in
 * Design_Patterns_Coding_Challenges.md, same shape as Challenge 1.2)
 *
 * A notification system supports multiple delivery channels.
 *
 * TODO:
 * - `Notifier` interface:
 *     `send(recipient: Recipient, message: string): Promise<void>`
 * - `EmailNotifier`, `SmsNotifier`, `PushNotifier` implementing it, each
 *   validating that the `Recipient` field it needs (`email`/`phone`/`userId`)
 *   is present.
 * - A `NotifierFactory` whose `create(channel: 'email' | 'sms' | 'push')`
 *   returns the right `Notifier`.
 * - `NotificationService` that asks the factory for a notifier, then sends
 *   through it. It must never instantiate a notifier directly.
 *
 * Focus:
 * - Adding a `WhatsAppNotifier` later should require changing only the
 *   factory and adding the new implementation.
 */
interface Recipient {
  email?: string;
  phone?: string;
  userId?: string;
}

interface Notifier {
  send(recipient: Recipient, message: string): Promise<void>;
}

class EmailNotifier implements Notifier {
  async send(recipient: Recipient, message: string): Promise<void> {
    if (!recipient.email) {
      throw new Error('Email address required for EmailNotifier');
    }
    console.log(`[Email] To: ${recipient.email} | Message: ${message}`);
  }
}

class SmsNotifier implements Notifier {
  async send(recipient: Recipient, message: string): Promise<void> {
    if (!recipient.phone) {
      throw new Error('Phone number required for SmsNotifier');
    }
    console.log(`[SMS] To: ${recipient.phone} | Message: ${message}`);
  }
}

class PushNotifier implements Notifier {
  async send(recipient: Recipient, message: string): Promise<void> {
    if (!recipient.userId) {
      throw new Error('User ID required for PushNotifier');
    }
    console.log(`[Push] To: ${recipient.userId} | Message: ${message}`);
  }
}

type NotificationChannel = 'email' | 'sms' | 'push';

class NotifierFactory {
  create(channel: NotificationChannel): Notifier {
    switch (channel) {
      case 'email':
        return new EmailNotifier();

      case 'sms':
        return new SmsNotifier();

      case 'push':
        return new PushNotifier();

      default:
        throw new Error(`Cannot send notification via channel: ${channel}`);
    }
  }
}

class NotificationService {
  constructor(private readonly notifierFactory: NotifierFactory) {}

  async notify(
    channel: NotificationChannel,
    recipient: Recipient,
    message: string,
  ): Promise<void> {
    const notifier = this.notifierFactory.create(channel);
    await notifier.send(recipient, message);
  }
}
const factory = new NotifierFactory();
const service = new NotificationService(factory);

await service.notify('email', { email: 'user@example.com' }, 'Welcome!');
await service.notify('sms', { phone: '+123456789' }, 'Your OTP is 4321');
await service.notify('push', { userId: 'usr_882' }, 'New login detected');
