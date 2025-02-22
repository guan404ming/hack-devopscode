import { test, expect } from '@playwright/test'
import { setup } from './utils'

const VITE_PORT = process.env.VITE_PORT || 5173

test('1.1 Title and Login Page Title (5%)', async ({ page }) => {
  await setup()
  await page.goto(`http://localhost:${VITE_PORT}/login`)
  const header = page.getByTestId('header-title')
  const logo = page.getByTestId('header-logo')

  // Expect title to be 'VSCoddit'
  await expect(page.title()).resolves.toMatch(/^VSCoddit$/)
  // Expect header to be 'VSCoddit'
  await expect(header).toHaveText('VSCoddit')
  // Expect logo to be '/vscoddit.svg' with alt 'VSCoddit Logo'
  await expect(logo).toHaveAttribute('src', '/vscoddit.svg')
  await expect(logo).toHaveAttribute('alt', 'VSCoddit Logo')
})

test('1.2 Redirect to Login Page (5%)', async ({ page }) => {
  await page.goto(`http://localhost:${VITE_PORT}/`)

  // Expect redirect to login page (check link)
  await expect(page).toHaveURL(`http://localhost:${VITE_PORT}/login`)
})

test('1.3 Route Configuration for Login and Register Pages (8%)', async ({ page }) => {
  await page.goto(`http://localhost:${VITE_PORT}/login`)

  const loginTab = page.getByTestId('tab-login')
  const registerTab = page.getByTestId('tab-register')
  const loginLink = page.getByTestId('link-login')
  const registerLink = page.getByTestId('link-register')

  // Expect register tab to be anchor with href to register page
  await expect(registerTab).toHaveText('Register')
  await expect(registerTab).toHaveAttribute('href', '/register')
  // Expect going to register page (check link)
  await registerTab.click()
  await expect(page).toHaveURL(`http://localhost:${VITE_PORT}/register`)

  // Expect login tab to be anchor with href to login page
  await expect(loginTab).toHaveText('Login')
  await expect(loginTab).toHaveAttribute('href', '/login')
  // Expect going to login page (check link)
  await loginTab.click()
  await expect(page).toHaveURL(`http://localhost:${VITE_PORT}/login`)

  // Expect register link to be anchor with href to register page
  await expect(registerLink).toHaveText("Don't have an account?")
  await expect(registerLink).toHaveAttribute('href', '/register')
  // Expect going to register page (check link)
  await registerLink.click()
  await expect(page).toHaveURL(`http://localhost:${VITE_PORT}/register`)

  // Expect login link to be anchor with href to login page
  await expect(loginLink).toHaveText('Already have an account?')
  await expect(loginLink).toHaveAttribute('href', '/login')
  // Expect going to login page (check link)
  await loginLink.click()
  await expect(page).toHaveURL(`http://localhost:${VITE_PORT}/login`)
})

test('1.4 Login Fails for Unregistered Users (8%)', async ({ page }) => {
  await page.goto(`http://localhost:${VITE_PORT}/login`)

  const usernameInput = page.getByTestId('input-username')
  const passwordInput = page.getByTestId('input-password')
  const loginButton = page.getByRole('button', { name: 'Login' })
  const toast = page.getByTestId('toast')

  // Check all fields' placeholder
  await expect(usernameInput).toHaveAttribute('placeholder', 'Enter Username')
  await expect(passwordInput).toHaveAttribute('placeholder', 'Enter Password')
  // Check all fields' required attribute
  await expect(usernameInput).toHaveAttribute('required', '')
  await expect(passwordInput).toHaveAttribute('required', '')

  // Input username and password
  await usernameInput.fill('username')
  await passwordInput.fill('password')
  await loginButton.click()
  // Expect alert to be shown
  await expect(toast).toHaveText('User not found', { timeout: 1000 })
})

test('1.5 Ensure User Registration Functions Properly (8%)', async ({ page }) => {
  await page.goto(`http://localhost:${VITE_PORT}/register`)

  const usernameInput = page.getByTestId('input-username')
  const passwordInput = page.getByTestId('input-password')
  const confirmPasswordInput = page.getByTestId('input-confirm-password')
  const registerButton = page.getByRole('button', { name: 'Register' })
  const toast = page.getByTestId('toast')

  // Check all fields' placeholder
  await expect(confirmPasswordInput).toHaveAttribute('placeholder', 'Confirm Password')
  // Check all fields' required attribute
  await expect(confirmPasswordInput).toHaveAttribute('required', '')

  // Input mismatch passwords
  await usernameInput.fill('username')
  await passwordInput.fill('password')
  await confirmPasswordInput.fill('wrong-password')
  await registerButton.click()
  // Expect alert to be shown
  await expect(toast).toHaveText('Passwords do not match')

  // Input correct username and password
  await usernameInput.fill('username')
  await passwordInput.fill('password')
  await confirmPasswordInput.fill('password')
  await registerButton.click()
  // Expect redirect to login page (check link)
  await expect(page).toHaveURL(`http://localhost:${VITE_PORT}/login`, { timeout: 1000 })
})
