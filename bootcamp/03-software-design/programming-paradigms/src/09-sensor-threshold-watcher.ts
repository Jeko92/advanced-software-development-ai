interface ThresholdWatcher {
  check(sensorId: string, value: number): void;
  getWatcherName(): string;
}

// abstract class BaseWatcher implements  ThresholdWatcher {
//   #describeReading(sensorId: string, value: number): string {
//     return `[${this.getWatcherName()}] Sensor ${sensorId} reading: ${value}`;
//   }
//
//   abstract isBreach(value: number): boolean;
//
//   check(sensorId: string, value: number): void {
//     console.log(this.#describeReading(sensorId, value));
//
//     if (this.isBreach(value)) {
//       console.log(`  └─ ⚠️  ALERT: ${this.getWatcherName()} threshold breached!`);
//     } else {
//       console.log(`  └─ ✅ OK: Within expected ${this.getWatcherName().toLowerCase()} limits.`);
//     }
//   }
//
//   abstract getWatcherName(): string;
// }

abstract class BaseWatcher implements ThresholdWatcher {
  abstract isBreach(value: number): boolean;
  abstract getWatcherName(): string;

  check(sensorId: string, value: number): void {
    const breach = this.isBreach(value);
    const payload = {
      timestamp: `${new Date().toLocaleDateString()}-${new Date().toLocaleTimeString()}`,
      watcher: this.getWatcherName(),
      sensorId,
      value,
      status: breach ? 'BREACH' : 'OK',
    };

    if (breach) {
      console.error('⚠️ [SENSOR_ALERT]', JSON.stringify(payload));
    } else {
      console.info('✅ [SENSOR_INFO]', JSON.stringify(payload));
    }
  }
}

class TemperatureWatcher extends BaseWatcher {
  override isBreach(value: number) {
    return value > 90;
  }

  override getWatcherName(): string {
    return 'Temperature';
  }
}
class HumidityWatcher extends BaseWatcher {
  override isBreach(value: number) {
    return value < 20;
  }

  override getWatcherName(): string {
    return 'Humidity';
  }
}

class SensorHub {
  #watchers: ThresholdWatcher[];

  constructor(watcehrs: ThresholdWatcher[]) {
    this.#watchers = watcehrs;
  }

  monitorAll(sensorId: string, value: number): void {
    for (const watcher of this.#watchers) {
      watcher.check(sensorId, value);
    }
  }
}

const hub = new SensorHub([new TemperatureWatcher(), new HumidityWatcher()]);

hub.monitorAll('S1', 92);

const temperatureWatcher = new TemperatureWatcher();
temperatureWatcher.check('S1', 92);
temperatureWatcher.check('S1', 89);

const humidityWatcher = new HumidityWatcher();
humidityWatcher.check('S1', 15);
humidityWatcher.check('S1', 22);
