interface Notifiable {
  notify(memberId: string, event: string, title: string): void;
  getChannelName(): string;
}

type ReservationStatus = 'reservation' | 'overdue';

abstract class BaseNotifier implements Notifiable {
  formatMessage(event: ReservationStatus, title: string): string {
    if (event === 'reservation') {
      return `Your reservation for '${title}' is confirmed.`;
    }
    return `Reminder: '${title}' is overdue.`;
  }

  abstract send(memberId: string, message: string): void;

  notify(memberId: string, event: ReservationStatus, title: string): void {
    const formattedMessage = this.formatMessage(event, title);
    this.send(memberId, formattedMessage);
  }

  abstract getChannelName(): string;
}

class EmailNotifier extends BaseNotifier {
  constructor() {
    super();
  }

  send(memberId: string, message: string): void {
    console.log(`Sending email to member #${memberId}: ${message}`);
  }

  getChannelName(): string {
    return 'email';
  }
}

class SmsNotifier extends BaseNotifier {
  constructor() {
    super();
  }

  send(memberId: string, message: string): void {
    console.log(`Sending SMS to member #${memberId}: ${message}`);
  }

  getChannelName(): string {
    return 'sms';
  }
}

class NotificationService {
  channels: Notifiable[];
  constructor(channels: Notifiable[]) {
    this.channels = channels;
  }

  dispatch(memberId: string, event: ReservationStatus, title: string): void {
    for (const channel of this.channels) {
      channel.notify(memberId, event, title);
    }
  }
}

export interface NotificationDispatchInput {
  memberId: string;
  event: ReservationStatus;
  title: string;
}

export const sampleReservationDispatch: NotificationDispatchInput = {
  memberId: '42',
  event: 'reservation',
  title: 'Dune',
};

export const sampleOverdueDispatch: NotificationDispatchInput = {
  memberId: '7',
  event: 'overdue',
  title: '1984',
};

const service = new NotificationService([
  new EmailNotifier(),
  new SmsNotifier(),
]);
service.dispatch(
  sampleReservationDispatch.memberId,
  sampleReservationDispatch.event,
  sampleReservationDispatch.title,
);
service.dispatch(
  sampleOverdueDispatch.memberId,
  sampleOverdueDispatch.event,
  sampleOverdueDispatch.title,
);
