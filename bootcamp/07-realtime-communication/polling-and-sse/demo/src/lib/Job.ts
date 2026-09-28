import { randomRange, sleep } from './utils';

export type JobValue = { value: number; done: boolean; packageId: number };
type Subscriber = (value: JobValue) => void;

export class Job {
  private value = 0;
  private done = false;
  private updateCounter = 0;
  private aborted = false;
  private subscribers = new Set<Subscriber>();

  async run() {
    while (!this.done) {
      await sleep();
      if (this.aborted) return;

      this.update();
      this.notifySubscribers();
    }
  }

  private update() {
    this.updateCounter++;
    this.value += randomRange(5, 15);
    this.value = Math.min(this.value, 100);
    this.done = this.value >= 100;

    console.log(this.getCurrentValue());
  }

  private notifySubscribers() {
    this.subscribers.forEach((subscriber) =>
      subscriber(this.getCurrentValue()),
    );
  }

  subscribe(subscriber: Subscriber) {
    this.subscribers.add(subscriber);
    return () => this.subscribers.delete(subscriber);
  }

  getCurrentValue() {
    return {
      value: this.value,
      done: this.done,
      packageId: this.updateCounter,
    };
  }

  getNextValue(): Promise<JobValue> {
    return new Promise((resolve) => {
      if (this.done) {
        resolve(this.getCurrentValue());
        return;
      }

      const unsubscribe = this.subscribe((value: JobValue) => {
        resolve(value);
        unsubscribe();
      });
    });
  }

  abort() {
    this.aborted = true;
    this.subscribers.clear();
  }
}
