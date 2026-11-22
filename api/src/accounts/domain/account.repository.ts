import type { Account } from './account.js';

export interface AccountRepository {
    findAll(): Promise<Account[]>;
    findByCode(code: string): Promise<Account | null>;
    hasChildren(code: string): Promise<boolean>;
    save(account: Account): Promise<void>;
    delete(code: string): Promise<void>;
}

export const ACCOUNT_REPOSITORY = Symbol('AccountRepository');
