import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { CreateAccount } from './application/create-account.js';
import { DeleteAccount } from './application/delete-account.js';
import { GetCatalogTree } from './application/get-catalog-tree.js';
import { ACCOUNT_REPOSITORY } from './domain/account.repository.js';
import type { AccountRepository } from './domain/account.repository.js';
import { InMemoryAccountRepository } from './infrastructure/in-memory-account.repository.js';
import { AccountsController } from './presentation/accounts.controller.js';
import { DomainErrorFilter } from './presentation/domain-error.filter.js';

@Module({
    controllers: [AccountsController],
    providers: [
        {
            provide: ACCOUNT_REPOSITORY, useClass: InMemoryAccountRepository },
        {
            provide: CreateAccount,
            useFactory: (repo: AccountRepository) => new CreateAccount(repo),
            inject: [ACCOUNT_REPOSITORY],
        },
        {
            provide: GetCatalogTree,
            useFactory: (repo: AccountRepository) => new GetCatalogTree(repo),
            inject: [ACCOUNT_REPOSITORY],
        },
        {
            provide: DeleteAccount,
            useFactory: (repo: AccountRepository) => new DeleteAccount(repo),
            inject: [ACCOUNT_REPOSITORY],
        },
        {
            provide: APP_FILTER, useClass: DomainErrorFilter
        },
    ],
})
export class AccountsModule {}