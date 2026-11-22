export abstract class DomainError extends Error {
    constructor(readonly field: string, message: string) {
        super(message);
    }
}

export class InvalidAccountCodeError extends DomainError {}
export class AccountAlreadyExistsError extends DomainError {}
export class ParentNotFoundError extends DomainError {}
export class AccountNotFoundError extends DomainError {}
export class AccountHasChildrenError extends DomainError {}