interface Alertable {
  alert(serviceId: string, severity: string, message: string): void;
  getSinkName(): string;
}

abstract class BaseAlertSink implements Alertable {
  #formatAlert(severity: 'warning' | 'critical', message: string): string {
    return `[${severity.toUpperCase()}] ${message}`;
  }

  abstract dispatch(serviceId: string, formatted: string): void;

  alert(
    serviceId: string,
    severity: 'warning' | 'critical',
    message: string,
  ): void {
    const formattedAlert = this.#formatAlert(severity, message);
    this.dispatch(serviceId, formattedAlert);
  }

  abstract getSinkName(): string;
}

class SlackSink extends BaseAlertSink {
  override dispatch(serviceId: string, formatted: string): void {
    console.log(`Posting to #alerts for service ${serviceId}: ${formatted}`);
  }

  override getSinkName(): string {
    return 'Slack';
  }
}

class PagerDutySink extends BaseAlertSink {
  override dispatch(serviceId: string, formatted: string): void {
    console.log(`Paging on-call for service ${serviceId}: ${formatted}`);
  }

  override getSinkName(): string {
    return 'Pager';
  }
}

interface AlertEvent {
  serviceId: string;
  severity: 'warning' | 'critical';
  message: string;
}

class AlertRouter {
  alerts: Alertable[];

  constructor(alerts: Alertable[]) {
    this.alerts = alerts;
  }

  broadcast(serviceId: string, severity: string, message: string) {
    this.alerts.forEach((alert) => {
      alert.alert(serviceId, severity, message);
    });
  }
}

const paymentsOutage: AlertEvent = {
  serviceId: 'payments-api',
  severity: 'critical',
  message: 'Payment gateway is not responding',
};

const ordersDelay: AlertEvent = {
  serviceId: 'orders-api',
  severity: 'warning',
  message: 'Order processing latency above threshold',
};

const alertsRouter = new AlertRouter([new SlackSink(), new PagerDutySink()]);
alertsRouter.broadcast(
  paymentsOutage.serviceId,
  paymentsOutage.severity,
  paymentsOutage.message,
);
alertsRouter.broadcast(
  ordersDelay.serviceId,
  ordersDelay.severity,
  ordersDelay.message,
);
