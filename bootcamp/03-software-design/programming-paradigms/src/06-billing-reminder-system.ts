interface Remindable {
  remind(customerId: string, billingEvent: string, planName: string): void;
  channelLabel(): string;
}

abstract class BaseReminder implements Remindable {
  #craftMessage(
    billingEvent: 'renewal' | 'failed_payment',
    planName: string,
  ): string {
    if (billingEvent === 'failed_payment') {
      return `Payment failed for your '${planName}' plan.`;
    }
    return `Your '${planName}' plan renews soon.`;
  }

  abstract deliver(customerId: string, message: string): void;

  remind(
    customerId: string,
    billingEvent: 'renewal' | 'failed_payment',
    planName: string,
  ): void {
    const craftedMessage = this.#craftMessage(billingEvent, planName);
    this.deliver(customerId, craftedMessage);
  }

  abstract channelLabel(): string;
}

class EmailReminder extends BaseReminder {
  override deliver(customerId: string, message: string): void {
    console.log(
      `${this.channelLabel()} reminder to customer ${customerId}. Message: ${message}`,
    );
  }

  override channelLabel(): string {
    return 'Email';
  }
}

class InAppReminder extends BaseReminder {
  override deliver(customerId: string, message: string): void {
    console.log(
      `${this.channelLabel()} reminder to customer ${customerId}. Message: ${message}`,
    );
  }

  override channelLabel(): string {
    return 'In-app';
  }
}

class PushReminder extends BaseReminder {
  constructor() {
    super();
  }

  override deliver(customerId: string, message: string): void {
    console.log(
      `${this.channelLabel()} reminder to customer ${customerId}. Message: ${message}`,
    );
  }

  override channelLabel(): string {
    return 'Push';
  }
}

class ReminderCenter {
  reminders: Remindable[];

  constructor(reminders: Remindable[]) {
    this.reminders = reminders;
  }

  sendReminders(
    customerId: string,
    billingEvent: 'renewal' | 'failed_payment',
    planName: string,
  ): void {
    this.reminders.forEach((reminder) => {
      reminder.remind(customerId, billingEvent, planName);
    });
  }
}

interface Reminder {
  customerId: string;
  billingEvent: 'renewal' | 'failed_payment';
  planName: string;
}

const proPlanReminder: Reminder = {
  customerId: 'C-3',
  billingEvent: 'failed_payment',
  planName: 'Pro',
};

const basicPlanReminder: Reminder = {
  customerId: 'C-4',
  billingEvent: 'renewal',
  planName: 'Basic',
};

const reminderCenter = new ReminderCenter([
  new EmailReminder(),
  new InAppReminder(),
  new PushReminder(),
]);
reminderCenter.sendReminders(
  proPlanReminder.customerId,
  proPlanReminder.billingEvent,
  proPlanReminder.planName,
);
reminderCenter.sendReminders(
  basicPlanReminder.customerId,
  basicPlanReminder.billingEvent,
  basicPlanReminder.planName,
);
