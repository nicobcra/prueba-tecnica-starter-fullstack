import { Account } from '../domain/account.js';
import type { AccountRepository } from '../domain/account.repository.js';

export class InMemoryAccountRepository implements AccountRepository {
    private readonly items = new Map<string, Account>();

    constructor() {
        [
            new Account('1', 'Activo', 'debit'),
            new Account('11', 'Disponible', 'debit'),
            new Account('1101', 'Caja', 'debit'),
            new Account('110101', 'Caja General', 'debit'),
            new Account('110102', 'Caja Chica', 'debit'),
            new Account('1102', 'Bancos', 'debit'),
            new Account('110201', 'Banco de Crédito del Perú', 'debit'),
            new Account('110202', 'Banco de la Nación', 'debit'),
            new Account('2', 'Pasivo', 'credit'),
            new Account('21', 'Obligaciones', 'credit'),
            new Account('2101', 'Obligaciones Bancarias', 'credit'),
            new Account('210101', 'Préstamos Bancarios', 'credit'),
            new Account('210102', 'Créditos Hipotecarios', 'credit'),
        ].forEach(a => this.items.set(a.code, a));
    }

    async findAll() { return [...this.items.values()]; }
    async findByCode(code: string) { return this.items.get(code) ?? null; }
    async hasChildren(code: string) {
        return [...this.items.values()].some((a) => a.code !== code && a.code.startsWith(code));
    }
    async save(account: Account) { this.items.set(account.code, account); }
    async delete(code: string) { this.items.delete(code); }
}

