const { test, expect } = require('@playwright/test');

test.describe('Authentication Tests', () => {
  test('Successful Login with Email', async ({ page }) => {
    await page.goto('http://localhost:3000/login');

    await page.fill('input[placeholder="Email address*"]', 'test@example.com');
    await page.fill('input[placeholder="Password*"]', 'password123');

    await page.click('button:has-text("Continue")');


    await expect(page).toHaveURL('http://localhost:3000/login');
    await expect(page.locator('h1')).toHaveText('Welcome to site');

  });

  test('Unsuccessful Login with Invalid Credentials', async ({ page }) => {

    await page.goto('http://localhost:3000/login');

    await page.fill('input[placeholder="Email address*"]', 'wronguser@example.com');
    await page.fill('input[placeholder="Password*"]', 'wrongpassword');

    await page.click('button:has-text("Continue")');

    const errorMessage = await page.locator('.error-message');
    await expect(errorMessage).toHaveText('User not found');
  });

  
});
