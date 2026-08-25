import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Concerts API is alive. Time to build /concerts — see INSTRUCTIONS.md.';
  }
}
