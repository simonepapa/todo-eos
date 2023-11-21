import {Chains, Session, SessionKit} from '@wharfkit/session'
import {WalletPluginPrivateKey} from '@wharfkit/wallet-plugin-privatekey'
import {WebRenderer} from '@wharfkit/web-renderer'

// The private key to use during development for our testnet account
const key = 'PVT_K1_2DK8hmjUJwsA1jfdps3uGRm82zhQ2jzZc6ThyJUKe3yRCer5Ni'

// The blockchain(s) this application is deployed on
const chains = [Chains.Jungle4]

// Create a new session kit instance
export const sessionKit = new SessionKit({
    appName: 'todo-app',
    chains,
    ui: new WebRenderer(),
    walletPlugins: [new WalletPluginPrivateKey(key)],
})

// Storage for the current user session
export let session: Session | undefined

// A function that performs the login and sets the session variable
export async function login() {
    const result = await sessionKit.login()
    session = result.session
}

// A function that performs the logout and clears the session variable
export async function logout() {
    await sessionKit.logout()
    session = undefined
}

// A function that performs the restore and sets the session variable
export async function restore() {
    session = await sessionKit.restore()
}
