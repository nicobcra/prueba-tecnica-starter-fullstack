import type { AccountRepository } from '../domain/account.repository.js';
import { AccountHasChildrenError, AccountNotFoundError } from '../domain/errors.js';

export class DeleteAccount {
  constructor(private readonly repo: AccountRepository) {}

  async execute(code: string): Promise<void> {
    if (!(await this.repo.findByCode(code)))
      throw new AccountNotFoundError('code', `La cuenta ${code} no existe`);
    if (await this.repo.hasChildren(code))
      throw new AccountHasChildrenError('code', `La cuenta ${code} tiene cuentas hijas y no se puede eliminar`);
    await this.repo.delete(code);
  }
}