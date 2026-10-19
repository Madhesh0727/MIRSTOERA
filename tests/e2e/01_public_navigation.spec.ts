import { test, expect } from '@playwright/test';

test.describe('E2E Suite 1 — Public Navigation & Brand Consistency', () => {
  test('Homepage loads with MIRSTOERA brand, slogan, and 4 experiences', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/MIRSTOERA/i);

    // Verify Brand slogan
    await expect(page.locator('text=Every Moment Deserves a Crown').first()).toBeVisible();

    // Verify all 4 experiences are rendered with approved pricing
    await expect(page.locator('text=Secret Gift Delivery').first()).toBeVisible();
    await expect(page.locator('text=₹799').first()).toBeVisible();

    await expect(page.locator('text=Mini Movie Proposal').first()).toBeVisible();
    await expect(page.locator('text=₹1,499').first()).toBeVisible();

    await expect(page.locator('text=Cinematic Birthday Surprise').first()).toBeVisible();
    await expect(page.locator('text=₹1,799').first()).toBeVisible();

    await expect(page.locator('text=Cinematic Hero Entry').first()).toBeVisible();
    await expect(page.locator('text=₹1,299').first()).toBeVisible();
  });

  test('Navigation bar links work across all primary pages', async ({ page }) => {
    await page.goto('/');

    // Experiences catalog
    await page.click('header nav a:has-text("Experiences")');
    await expect(page).toHaveURL(/\/experiences/);
    await expect(page.locator('h1').first()).toContainText(/Experiences/i);

    // Our Story
    await page.click('header nav a:has-text("Our Story")');
    await expect(page).toHaveURL(/\/our-story/);
    await expect(page.locator('h1').first()).toContainText(/Story/i);

    // Gallery
    await page.click('header nav a:has-text("Gallery")');
    await expect(page).toHaveURL(/\/gallery/);
    await expect(page.locator('h1').first()).toContainText(/Gallery/i);

    // Contact
    await page.click('header nav a:has-text("Contact")');
    await expect(page).toHaveURL(/\/contact/);
    await expect(page.locator('h1').first()).toContainText(/Contact/i);

    // Book CTA in navbar
    await page.click('header a:has-text("Plan My Surprise")');
    await expect(page).toHaveURL(/\/book/);
    await expect(page.locator('h1').first()).toContainText(/Book/i);
  });

  test('Footer links and legal pages render properly', async ({ page }) => {
    await page.goto('/');

    // Privacy Policy
    await page.click('footer a[href="/privacy"]');
    await expect(page).toHaveURL(/\/privacy/);
    await expect(page.locator('h1').first()).toContainText(/Privacy/i);

    // Terms of Service
    await page.goto('/');
    await page.click('footer a[href="/terms"]');
    await expect(page).toHaveURL(/\/terms/);
    await expect(page.locator('h1').first()).toContainText(/Terms/i);
  });

  test('Experience detail page loads with details and Book CTA', async ({ page }) => {
    await page.goto('/experiences/birthday-surprise');
    await expect(page.locator('h1').first()).toContainText('Cinematic Birthday Surprise');
    await expect(page.locator('text=₹1,799').first()).toBeVisible();

    // Clicking Book CTA carries service pre-selection
    const bookBtn = page.locator('a:has-text("Book This Experience")').first();
    await bookBtn.click();
    await expect(page).toHaveURL(/\/book\?service=birthday-surprise/);
  });

  test('404 Page handles non-existent routes gracefully', async ({ page }) => {
    await page.goto('/non-existent-page-route-12345');
    await expect(page.locator('h1').first()).toContainText(/This Moment Is Elsewhere/i);
    await expect(page.locator('a[href="/"]').first()).toBeVisible();
  });
});
