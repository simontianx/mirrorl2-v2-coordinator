import * as ethers from 'ethers';
import * as fs from 'fs';

export class Whitelist {
  private whitelist: Set<string> | undefined;

  constructor() {
    this.load();
  }

  has(id: string): boolean {
    return this.whitelist === undefined || this.whitelist.has(id);
  }

  size(): number {
    return this.whitelist ? this.whitelist.size : 0;
  }

  private load() {
    const path = 'whitelist.txt';
    if (fs.existsSync(path)) {
      this.whitelist = new Set(
        fs
          .readFileSync(path)
          .toString()
          .split('\n')
          .map(s => s.trim())
          .filter(s => s.length > 0)
          .map(s => ethers.utils.getAddress(s))
      );

      console.log('whitelist loaded: ', this.whitelist.size);
    }
  }
}
