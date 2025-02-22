import { test } from '@playwright/test'
import { examineLoremPost, expectIcon, login, setup } from './utils'

test('2.1 Render Post With PostCard and PostContext (3%)', async ({ page }) => {
  await setup()
  await login(page)
  await examineLoremPost(page, 0)
})

test('2.2 Navigation with ViewFooter Buttons (8%)', async ({ page }) => {
  await login(page)
  const prevButton = page.getByTestId('prev-btn')
  const nextButton = page.getByTestId('next-btn')

  await examineLoremPost(page, 0)
  await nextButton.click()
  await examineLoremPost(page, 1)
  await nextButton.click()
  await examineLoremPost(page, 0)
  await nextButton.click()
  await examineLoremPost(page, 1)
  await prevButton.click()
  await examineLoremPost(page, 0)
  await prevButton.click()
  await examineLoremPost(page, 1)
  await prevButton.click()
  await examineLoremPost(page, 0)
  await prevButton.click()
  await nextButton.click()
  await examineLoremPost(page, 0)
  await nextButton.click()
  await prevButton.click()
  await nextButton.click()
  await examineLoremPost(page, 1)
})

test('2.3 Navigation with Keyboard (3%)', async ({ page }) => {
  await login(page)

  await examineLoremPost(page, 0)
  await page.keyboard.press('ArrowRight')
  await examineLoremPost(page, 1)
  await page.keyboard.press('ArrowRight')
  await examineLoremPost(page, 0)
  await page.keyboard.press('ArrowRight')
  await examineLoremPost(page, 1)
  await page.keyboard.press('ArrowLeft')
  await examineLoremPost(page, 0)
  await page.keyboard.press('ArrowLeft')
  await examineLoremPost(page, 1)
  await page.keyboard.press('ArrowLeft')
  await examineLoremPost(page, 0)
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowRight')
  await examineLoremPost(page, 0)
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowRight')
  await examineLoremPost(page, 1)
})

test('2.4 Handle Voting for Unvoted Posts (8%)', async ({ page }) => {
  const upvoteButton = page.getByTestId('upvote-btn')
  const nextButton = page.getByTestId('next-btn')
  const downvoteButton = page.getByTestId('downvote-btn')

  await login(page)
  await upvoteButton.click()
  await expectIcon(page, 'upvote', 'filled')
  await nextButton.click()
  await downvoteButton.click()
  await expectIcon(page, 'downvote', 'filled')
})

test('2.5 Handle Voting for Voted Posts (12%)', async ({ page }) => {
  const upvoteButton = page.getByTestId('upvote-btn')
  const downvoteButton = page.getByTestId('downvote-btn')

  const runSubtests = async (numSubtests = 1) => {
    /* TEST: Upvote and undo upvote */
    for (let i = 0; i < numSubtests; ++i) {
<<<<<<< HEAD
      await upvoteButton.click();
      await page.waitForTimeout(100);
      await expectIcon(page, "upvote", "filled");
      await upvoteButton.click();
      await page.waitForTimeout(100);
      await expectIcon(page, "downvote", "empty");
=======
      await upvoteButton.click()
      await expectIcon(page, 'upvote', 'filled')
      await upvoteButton.click()
      await expectIcon(page, 'downvote', 'empty')
>>>>>>> c807c180bd346e88f08c7d4a98ea4ddb9c3ef333
    }
    /* END TEST: Upvote and undo upvote */

    /* TEST: Downvote and undo downvote */
    for (let i = 0; i < numSubtests; ++i) {
<<<<<<< HEAD
      await downvoteButton.click();
      await page.waitForTimeout(100);
      await expectIcon(page, "downvote", "filled");
      await downvoteButton.click();
      await page.waitForTimeout(100);
      await expectIcon(page, "downvote", "empty");
=======
      await downvoteButton.click()
      await expectIcon(page, 'downvote', 'filled')
      await downvoteButton.click()
      await expectIcon(page, 'downvote', 'empty')
>>>>>>> c807c180bd346e88f08c7d4a98ea4ddb9c3ef333
    }
    /* END TEST: Downvote and undo downvote */

    /* TEST: Upvote downvoted post */
    for (let i = 0; i < numSubtests; ++i) {
<<<<<<< HEAD
      await downvoteButton.click();
      await expectIcon(page, "downvote", "filled");
      await upvoteButton.click();
      await page.waitForTimeout(100);
      await expectIcon(page, "downvote", "empty");
      await expectIcon(page, "upvote", "filled");
      await upvoteButton.click();
      await page.waitForTimeout(100);
      await expectIcon(page, "downvote", "empty");
=======
      await downvoteButton.click()
      await expectIcon(page, 'downvote', 'filled')
      await upvoteButton.click()
      await expectIcon(page, 'downvote', 'empty')
      await expectIcon(page, 'upvote', 'filled')
      await upvoteButton.click()
      await expectIcon(page, 'downvote', 'empty')
>>>>>>> c807c180bd346e88f08c7d4a98ea4ddb9c3ef333
    }
    /* END TEST: Upvote downvoted post */

    /* TEST: Downvote upvoted post */
    for (let i = 0; i < numSubtests; ++i) {
<<<<<<< HEAD
      await upvoteButton.click();
      await expectIcon(page, "upvote", "filled");
      await downvoteButton.click();
      await page.waitForTimeout(100);
      await expectIcon(page, "downvote", "empty");
      await expectIcon(page, "downvote", "filled");
      await downvoteButton.click();
      await page.waitForTimeout(100);
      await expectIcon(page, "downvote", "empty");
=======
      await upvoteButton.click()
      await expectIcon(page, 'upvote', 'filled')
      await downvoteButton.click()
      await expectIcon(page, 'downvote', 'empty')
      await expectIcon(page, 'downvote', 'filled')
      await downvoteButton.click()
      await expectIcon(page, 'downvote', 'empty')
>>>>>>> c807c180bd346e88f08c7d4a98ea4ddb9c3ef333
    }
    /* END TEST: Downvote upvoted post */
  }

  await setup()
  await login(page)

  await runSubtests()
})
