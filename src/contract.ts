import type {Action, NameType, UInt64Type} from '@wharfkit/antelope'
import {ABI, Blob, Name, Struct, TimePoint, UInt64} from '@wharfkit/antelope'
import type {ActionOptions, ContractArgs, PartialBy, Table} from '@wharfkit/contract'
import {Contract as BaseContract} from '@wharfkit/contract'
export const abiBlob = Blob.from(
    'DmVvc2lvOjphYmkvMS4yAAUDYWRkAAIGYXV0aG9yBG5hbWULZGVzY3JpcHRpb24Gc3RyaW5nBWVyYXNlAAIGYXV0aG9yBG5hbWUCaWQGdWludDY0CGVyYXNlYWxsAAEGYXV0aG9yBG5hbWULc2V0Y29tcGxldGUAAwZhdXRob3IEbmFtZQJpZAZ1aW50NjQIY29tcGxldGUEYm9vbAh0b2RvX3JvdwAFAmlkBnVpbnQ2NAZhdXRob3IEbmFtZQl0aW1lc3RhbXAKdGltZV9wb2ludAtkZXNjcmlwdGlvbgZzdHJpbmcJY29tcGxldGVkBnVpbnQ2NAQAAAAAAABSMgNhZGQAAAAAAACFzVUFZXJhc2UAAAAAMRqFzVUIZXJhc2VhbGwAAFRWsUqKssILc2V0Y29tcGxldGUAAQAAAAAATBPNA2k2NAAACHRvZG9fcm93AAAAAAA='
)
export const abi = ABI.from(abiBlob)
export namespace Types {
    @Struct.type('add')
    export class add extends Struct {
        @Struct.field(Name)
        author!: Name
        @Struct.field('string')
        description!: string
    }
    @Struct.type('erase')
    export class erase extends Struct {
        @Struct.field(Name)
        author!: Name
        @Struct.field(UInt64)
        id!: UInt64
    }
    @Struct.type('eraseall')
    export class eraseall extends Struct {
        @Struct.field(Name)
        author!: Name
    }
    @Struct.type('setcomplete')
    export class setcomplete extends Struct {
        @Struct.field(Name)
        author!: Name
        @Struct.field(UInt64)
        id!: UInt64
        @Struct.field('bool')
        complete!: boolean
    }
    @Struct.type('todo_row')
    export class todo_row extends Struct {
        @Struct.field(UInt64)
        id!: UInt64
        @Struct.field(Name)
        author!: Name
        @Struct.field(TimePoint)
        timestamp!: TimePoint
        @Struct.field('string')
        description!: string
        @Struct.field(UInt64)
        completed!: UInt64
    }
}
export const TableMap = {
    todos: Types.todo_row,
}
export interface TableTypes {
    todos: Types.todo_row
}
export type RowType<T> = T extends keyof TableTypes ? TableTypes[T] : any
export type TableNames = keyof TableTypes
export namespace ActionParams {
    export namespace Type {}
    export interface add {
        author: NameType
        description: string
    }
    export interface erase {
        author: NameType
        id: UInt64Type
    }
    export interface eraseall {
        author: NameType
    }
    export interface setcomplete {
        author: NameType
        id: UInt64Type
        complete: boolean
    }
}
export interface ActionNameParams {
    add: ActionParams.add
    erase: ActionParams.erase
    eraseall: ActionParams.eraseall
    setcomplete: ActionParams.setcomplete
}
export type ActionNames = keyof ActionNameParams
export class Contract extends BaseContract {
    constructor(args: PartialBy<ContractArgs, 'abi' | 'account'>) {
        super({
            client: args.client,
            abi: abi,
            account: args.account || Name.from('cj2p1lhcmbrw'),
        })
    }
    action<T extends ActionNames>(
        name: T,
        data: ActionNameParams[T],
        options?: ActionOptions
    ): Action {
        return super.action(name, data, options)
    }
    table<T extends TableNames>(name: T, scope?: NameType): Table<RowType<T>> {
        return super.table(name, scope, TableMap[name])
    }
}
