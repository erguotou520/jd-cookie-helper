import { homedir } from 'node:os'
import { join } from 'node:path'
import { existsSync, mkdirSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { Account } from './types'

const storageDir = join(homedir(), '.jd-cookie-helper')
if (!existsSync(storageDir)) {
  mkdirSync(storageDir)
}

const accountsFile = join(storageDir, 'accounts.json')

export function saveAccounts(accounts: Account[]) {
  return writeFile(accountsFile, JSON.stringify(accounts), 'utf-8')
}

export function readAccounts(): Promise<Account[]> {
  return readFile(accountsFile, 'utf-8').then(str => {
    try {
      return JSON.parse(str) as Account[]
    } catch (error) {
      return []
    }
  }).catch(() => [])
}