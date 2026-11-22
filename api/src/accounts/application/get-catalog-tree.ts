import { Account } from '../domain/account.js';
import type { AccountRepository } from '../domain/account.repository.js';

export interface AccountNode {
    code: string;
    name: string;
    level: string;
    nature: string;
    children: AccountNode[];
}

export class GetCatalogTree {
    constructor(private readonly accountRepository: AccountRepository) {}

    async execute(): Promise<AccountNode[]> {
        const all = (await this.accountRepository.findAll()).sort((a, b) => a.code.localeCompare(b.code));
        const nodes = new Map<string, AccountNode>();
        for (const a of all) 
            nodes.set(a.code, { code: a.code, name: a.name, level: a.level, nature: a.nature, children: [] });

        const roots: AccountNode[] = [];
        for (const a of all) {
            const parentCode = Account.parentCodeOf(a.code);
            const node = nodes.get(a.code)!;
            if (parentCode && nodes.has(parentCode)) nodes.get (parentCode)!.children.push(node);
            else roots.push(node);
        }
        return roots;
    }
}