import {Chains, Session, SessionKit} from '@wharfkit/session'
import {TransactPluginResourceProvider} from '@wharfkit/transact-plugin-resource-provider'
import {WalletPluginPrivateKey} from '@wharfkit/wallet-plugin-privatekey'
import {WebRenderer} from '@wharfkit/web-renderer'
import {writable, type Writable} from 'svelte/store'

// The private key to use during development for our testnet account
const key = 'PVT_K1_zpEJtu6MoLYGVwFrTaDCdwJvtywmjEKSqFcU1fqTpoXhtH28G'

// The blockchain(s) this application is deployed on
const chains = [Chains.Jungle4]

// Create a new session kit instance
export const sessionKit = new SessionKit(
    {
        appName: 'todo-app',
        chains,
        ui: new WebRenderer(),
        walletPlugins: [new WalletPluginPrivateKey(key)],
    },
    {
        transactPlugins: [new TransactPluginResourceProvider()],
    }
)

// Storage for the current user session
export let session: Writable<Session | undefined> = writable()

// A function that performs the login and sets the session variable
export async function login() {
    const result = await sessionKit.login()
    session.set(result.session)
}

// A function that performs the logout and clears the session variable
export async function logout() {
    await sessionKit.logout()
    session.set(undefined)
}

// A function that performs the restore and sets the session variable
export async function restore() {
    session.set(await sessionKit.restore())
}
