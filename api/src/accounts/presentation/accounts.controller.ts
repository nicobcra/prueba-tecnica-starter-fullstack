import {Body, Controller, Delete, HttpCode, Get, Param, Post, Copy} from '@nestjs/common';
import {CreateAccount} from '../application/create-account.js';
import type {CreateAccountRequest} from '../application/create-account.js';
import {GetCatalogTree} from '../application/get-catalog-tree.js';
import {DeleteAccount} from '../application/delete-account.js';

@Controller('accounts')
export class AccountsController {
    constructor(
        private readonly createAccount: CreateAccount,
        private readonly getCatalogTree: GetCatalogTree,
        private readonly deleteAccount: DeleteAccount,
    ) {}

    @Get()
    tree() {
        return this.getCatalogTree.execute();
    }

    @Post()
    async create(@Body() input: CreateAccountRequest) {
        const account = await this.createAccount.execute(input);
        return {
            code: account.code,
            name: account.name,
            nature: account.nature,
        };
    }

    @Delete(':code')
    @HttpCode(204)
    async delete(@Param('code') code: string) {
        await this.deleteAccount.execute(code);
    }
}
