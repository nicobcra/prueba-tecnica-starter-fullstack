import { Account } from '../domain/account.js';
import type { AccountRepository } from '../domain/account.repository.js';

export class InMemoryAccountRepository implements AccountRepository {
    private readonly items = new Map<string, Account>();

    constructor() {
         [
            new Account('1', 'Activo', 'debit'),
            new Account('11', 'Disponible', 'debit'),
            new Account('1105', 'Caja', 'debit'),
            new Account('110505', 'Caja general', 'debit'),
            new Account('110510', 'Caja menor', 'debit'),
            new Account('2', 'Pasivo', 'credit'),
            new Account('21', 'Obligaciones financieras', 'credit'),
            new Account('2105', 'Bancos nacionales', 'credit'),
            ].forEach((a) => this.items.set(a.code, a));
    }

    async findAll() { return [...this.items.values()]; }
    async findByCode(code: string) { return this.items.get(code) ?? null; }
    async hasChildren(code: string) {
        return [...this.items.values()].some((a) => a.code !== code && a.code.startsWith(code));
    }
    async save(account: Account) { this.items.set(account.code, account); }
    async delete(code: string) { this.items.delete(code); }
}

