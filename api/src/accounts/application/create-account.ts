import { Account } from '../domain/account.js';
import type { Nature } from '../domain/account.js';
import type { AccountRepository } from '../domain/account.repository.js';
import {
    AccountAlreadyExistsError,
    InvalidAccountCodeError,
    ParentNotFoundError,
} from '../domain/errors.js';

export interface CreateAccountRequest {
    code: unknown;
    name: unknown;
    nature?: unknown;
}

export class CreateAccount {
    constructor(private readonly accountRepository: AccountRepository) {}

    async execute(input: CreateAccountRequest): Promise<Account> {
        const code = typeof input.code === 'string' ? input.code : '';
        const name = typeof input.name === 'string' ? input.name : '';
        
        if (!Account.isValidCode(code)) 
            throw new InvalidAccountCodeError('code', `El código deber ser numérico y tener una longitud 
                de 1, 2, 4 o 6 caracteres. Código recibido: ${code}`);
        if (!name) 
            throw new InvalidAccountCodeError('name', `El nombre es obligatorio. Nombre recibido: ${name}`);
        if (await this.accountRepository.findByCode(code))
            throw new AccountAlreadyExistsError('code', `El codigo ${code} ya existe.`);

        const parentCode = Account.parentCodeOf(code);
        let nature: Nature;
        if (parentCode === null) {
            if (input.nature !== 'debit' && input.nature !== 'credit') 
                throw new InvalidAccountCodeError('nature', `La naturaleza de la cuenta es obligatoria y debe ser
             'debit' o 'credit'. Naturaleza recibida: ${input.nature}`);
            nature = input.nature;
        } else {
            const parent = await this.accountRepository.findByCode(parentCode);
            if (!parent)
                throw new ParentNotFoundError('code', `No se encontró la cuenta padre con código ${parentCode}`);
            nature = parent.nature;
        }

        const account = new Account(code, name, nature);
        await this.accountRepository.save(account);
        return account;
    }
    }
