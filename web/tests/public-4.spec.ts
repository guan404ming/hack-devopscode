import { expect, test } from '@playwright/test'
import { login, setup } from './utils'

test('4.1 Render User Information - bio (4%)', async ({ page }) => {
  await setup()
  await login(page)
  await page.getByTestId('tab-settings').click({ timeout: 1200 })

  const label = page.getByTestId('label-bio')
  const textarea = page.getByTestId('textarea-bio')

  // Expect label to be 'Bio'
  await expect(label).toHaveText('Bio')
  // Expect textarea to have placeholder 'Tell us a little bit about yourself'
  await expect(textarea).toHaveAttribute('placeholder', 'Tell us a little bit about yourself')
})

test('4.2 Render User Information - gender (8%)', async ({ page }) => {
  await login(page)
  await page.getByTestId('tab-settings').click({ timeout: 1200 })

  const label = page.getByTestId('label-sex')

  // Expect label to be ''Male', 'Female', 'Other'
  await expect(label).toHaveText(['What is your gender?', 'Male', 'Female', 'Other'])
})

test('4.3 Render User Information - profile picture 1 (6%)', async ({ page }) => {
  await login(page)
  await page.getByTestId('tab-settings').click({ timeout: 1200 })

  const label = page.getByTestId('label-upload')
  const profilePicture = page.getByTestId('label-profile-picture')

  // Expect label to be 'Upload a picture'
  await expect(label).toHaveText('Upload a picture')
  // Expect no profile picture
  await expect(profilePicture).toBeHidden()

  // Update profile picture by uploading a file
  await page.setInputFiles('input[type=file]', 'tests/pic1.png')
  // Expect no label
  await expect(label).toBeHidden()
  // Expect profile picture to have alt 'Uploaded Profile Picture'
  await expect(profilePicture).toBeVisible()
  await expect(profilePicture).toHaveAttribute('alt', 'Uploaded Profile Picture')
})

test('4.4 Update User Information (6%)', async ({ page }) => {
  await login(page)
  await page.getByTestId('tab-settings').click({ timeout: 1200 })

  const usernameInput = page.getByTestId('input-username')
  const bioTextarea = page.getByTestId('textarea-bio')
  const genderButton = page.getByLabel('Other', { exact: true })
  const submitButton = page.getByRole('button', { name: 'Update Profile' })

  // Update user information
  await usernameInput.fill('new test')
  await bioTextarea.fill('new bio')
  await genderButton.click()
  await page.setInputFiles('input[type=file]', 'tests/pic1.png')
  await submitButton.click()

  // Expect all fields to be updated
  await login(page, 'new test')
  await page.getByTestId('tab-settings').click({ timeout: 1200 })
  await expect(usernameInput).toHaveValue('new test')
  await expect(bioTextarea).toHaveValue('new bio')
  await expect(genderButton).toBeChecked()
})

test('4.5 Render User Information - profile picture 2 (5%)', async ({ page }) => {
  await login(page, 'new test')
  await page.getByTestId('tab-settings').click({ timeout: 1200 })
  const profilePicture = page.getByTestId('label-profile-picture')

  await expect(profilePicture).toBeVisible()
  await expect(profilePicture).toHaveAttribute('alt', 'Profile Picture')

  // Update profile picture by uploading a file
  await page.setInputFiles('input[type=file]', 'tests/pic2.png')
  // Expect profile picture to have alt 'Uploaded Profile Picture'
  await expect(profilePicture).toBeVisible()
  await expect(profilePicture).toHaveAttribute('alt', 'Uploaded Profile Picture')

  // Remove uploaded profile picture
  await page.setInputFiles('input[type=file]', [])
  // Expect profile picture to have alt 'Profile Picture'
  await expect(profilePicture).toBeVisible()
  await expect(profilePicture).toHaveAttribute('alt', 'Profile Picture')
})
