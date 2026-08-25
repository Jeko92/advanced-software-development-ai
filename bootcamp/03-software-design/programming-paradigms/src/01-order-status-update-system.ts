interface OrderNotifiable {
  notify(orderId: string, status: string, item: string): void;
  getChannelName(): string;
}

type OrderStatus = 'shipped' | 'cancelled';

abstract class BaseOrderNotifier implements OrderNotifiable {
  formatMessage(status: OrderStatus, item: string): string {
    if (status === 'shipped') {
      return `Your order for '${item}' has shipped.`;
    }

    return `Your order for '${item}' was cancelled.`;
  }

  abstract deliver(orderId: string, item: string): void;

  notify(orderId: string, status: OrderStatus, item: string): void {
    const formattedMessage = this.formatMessage(status, item);
    this.deliver(orderId, formattedMessage);
  }

  abstract getChannelName(): string;
}

class PushNotifier extends BaseOrderNotifier {
  deliver(orderId: string, message: string) {
    console.log(`Push to order #${orderId}: ${message}`);
  }

  override getChannelName(): string {
    return 'push';
  }
}

class WebhookNotifier extends BaseOrderNotifier {
  deliver(orderId: string, message: string) {
    console.log(`Webhook for order #${orderId}: ${message}`);
  }

  override getChannelName(): string {
    return 'webhook';
  }
}

class OrderDispatchService {
  channels: OrderNotifiable[];
  constructor(channels: OrderNotifiable[]) {
    this.channels = channels;
  }

  dispatch(orderId: string, status: OrderStatus, item: string): void {
    for (const channel of this.channels) {
      channel.notify(orderId, status, item);
    }
  }
}

interface NotificationDispatchInput {
  orderId: string;
  status: OrderStatus;
  name: string;
}

export const sampleShippedDispatch: NotificationDispatchInput = {
  orderId: 'ORD-9',
  status: 'shipped',
  name: 'Widget',
};

export const sampleCancelledDispatch: NotificationDispatchInput = {
  orderId: 'ORD-10',
  status: 'cancelled',
  name: 'Mouse',
};

const service = new OrderDispatchService([
  new PushNotifier(),
  new WebhookNotifier(),
]);
service.dispatch(
  sampleShippedDispatch.orderId,
  sampleShippedDispatch.status,
  sampleShippedDispatch.name,
);
service.dispatch(
  sampleCancelledDispatch.orderId,
  sampleCancelledDispatch.status,
  sampleCancelledDispatch.name,
);
