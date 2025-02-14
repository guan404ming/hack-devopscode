import { Page, expect } from '@playwright/test'
import dotenv from 'dotenv'

dotenv.config({ path: './frontend/.env' })
dotenv.config({ path: './backend/.env' })

const VITE_PORT = process.env.VITE_PORT || 5173
const PORT = process.env.PORT || 6969

const formatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

export const setup = async () => {
  await fetch(`http://localhost:${PORT}/api/init`, { method: 'POST' })
}

export const login = async (page: Page, username = 'test') => {
  await page.goto(`http://localhost:${VITE_PORT}/login`)
  await page.getByTestId('input-username').fill(username)
  await page.getByTestId('input-password').fill('123')
  await page.getByRole('button', { name: 'Login' }).click()
}

export const examineLoremPost = async (page: Page, index: number) => {
  const title = page.getByTestId('post-title')
  const author = page.getByTestId('post-author')
  const date = page.getByTestId('post-date')
  const content = page.getByTestId('post-content')

  if (index === 0) {
    await expect(title).toHaveText('hello.py')
    await expect(author).toHaveText('test')
    await expect(date).toHaveText(`Posted on ${formatter.format(new Date())}`)
    await expect(content).toHaveText(`1print("Hello, world!")\n2`)
  } else if (index === 1) {
    await expect(title).toHaveText('hello.rs')
    await expect(author).toHaveText('test')
    await expect(date).toHaveText(`Posted on ${formatter.format(new Date())}`)
    await expect(content).toHaveText(`1fn main() {
2    println!("Hello, world!");
3}
4`)
  } else if (index === 2) {
    await expect(title).toHaveText('Lorem Post 3', { timeout: 3000 })
    await expect(author).toHaveText('test')
    await expect(date).toHaveText(`Posted on ${formatter.format(new Date())}`)
    await expect(content).toHaveText(`1console.log('hello world!')console.log(\"Hello, Lorem Post 3!\")`)
  }
}

export const examineLoremPostEditor = async (page: Page, index: number) => {
  const editor = page.getByTestId('editor')

  if (index === 0) {
    await expect(editor).toHaveText(`12print("Hello, world!")`)
  } else if (index === 1) {
    await expect(editor).toHaveText(`1234fn main() {    println!("Hello, world!");}`)
  }
}

export const expectIcon = async (page: Page, iconType: 'upvote' | 'downvote', state: 'filled' | 'empty', timeout = 1500) => {
  await expect(iconType === 'upvote' ? page.getByTestId('upvote-icon') : page.getByTestId('downvote-icon')).toHaveAttribute('fill', state === 'filled' ? 'currentColor' : '', {
    timeout,
  })
}
