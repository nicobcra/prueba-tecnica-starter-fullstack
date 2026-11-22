export type Nature = 'debit' | 'credit';
export type Level = 'class' | 'group' | 'account' | 'subaccount';

const LEVEL_BY_LENGTH: Record<number, Level> = {
  1: 'class',
  2: 'group',
  4: 'account',
  6: 'subaccount',
};

export class Account {
  constructor(
    readonly code: string,
    readonly name: string,
    readonly nature: Nature,
  ) {}

  static isValidCode(code: string): boolean {
    return /^\d+$/.test(code) && code.length in LEVEL_BY_LENGTH;
  }

  get level(): Level {
    return LEVEL_BY_LENGTH[this.code.length];
  }

  static parentCodeOf(code: string): string | null {
    const lengths = [1, 2, 4, 6];
    const i = lengths.indexOf(code.length);
    return i <= 0 ? null : code.slice(0, lengths[i - 1]);
  }
}