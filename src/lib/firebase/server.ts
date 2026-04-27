import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { firebaseConfig } from './config'

// Named 'server' app instance — separate from the default client app
const serverApp = getApps().find(a => a.name === 'server') ?? initializeApp(firebaseConfig, 'server')
export const serverDb = getFirestore(serverApp)
