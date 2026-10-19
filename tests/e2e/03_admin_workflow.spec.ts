import { test, expect } from '@playwright/test';

test.describe('E2E Suite 3 — Admin Portal & Booking Lifecycle', () => {
  test('Unauthenticated user is redirected to login when accessing /admin', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.locator('input[name="email"], input[type="email"]')).toBeVisible();
  });

  test('Rejects invalid admin credentials with generic error', async ({ page }) => {
    await page.goto('/admin/login');

    await page.fill('input[name="email"]', 'wrong@mirstoera.in');
    await page.fill('input[name="password"]', 'WrongPassword123!');
    await page.click('button[type="submit"]');

    // Error alert is rendered
    await expect(page.locator('text=/Invalid administrative email or password/i').first()).toBeVisible();
  });

  test('Admin logs in successfully, manages enquiry lifecycle, and logs out', async ({ page }) => {
    // 1. Login
    await page.goto('/admin/login');
    await page.fill('input[name="email"]', 'admin@mirstoera.in');
    await page.fill('input[name="password"]', 'RoyalMirstoeraAdmin2026!');
    await page.click('button[type="submit"]');

    // Should redirect to /admin/dashboard
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 10000 });
    await expect(page.locator('h1:has-text("Concierge Operations Dashboard")').first()).toBeVisible();

    // Verify metric cards
    await expect(page.locator('text=Total Requests').first()).toBeVisible();
    await expect(page.locator('text=New Enquiries').first()).toBeVisible();

    // 2. View Enquiries table
    await page.click('aside nav a:has-text("Enquiries")');
    await expect(page).toHaveURL(/\/admin\/enquiries/);
    await expect(page.locator('h1:has-text("All Royal Enquiries")').first()).toBeVisible();

    // Verify enquiries table rows exist
    const rows = page.locator('table tbody tr');
    await expect(rows.first()).toBeVisible();

    // 3. Click on Manage link of the first enquiry to open details
    const firstManageLink = page.locator('table tbody tr a:has-text("Manage")').first();
    await firstManageLink.click();

    // Verify detail page
    await expect(page).toHaveURL(/\/admin\/enquiries\/\d+/);
    await expect(page.locator('text=Customer & Event Overview').first()).toBeVisible();

    // 4. Update status transition
    const statusSelect = page.locator('select').first();
    if (await statusSelect.isVisible()) {
      const options = await statusSelect.locator('option').allTextContents();
      const transitionOpt = options.find((opt) => opt.includes('Transition to →'));
      if (transitionOpt) {
        await statusSelect.selectOption({ label: transitionOpt });
        const applyBtn = page.locator('button:has-text("Apply Status & Quotation")');
        await applyBtn.click();
        await expect(page.locator('text=/Status successfully transitioned/i').first()).toBeVisible({ timeout: 5000 });
      }
    }

    // 5. Add internal note
    const noteTextarea = page.locator('textarea[placeholder*="customer conversation" i]');
    if (await noteTextarea.isVisible()) {
      await noteTextarea.fill('Customer contacted via royal concierge. Patron requested custom fanfare entry.');
      const addNoteBtn = page.locator('button:has-text("Add Note")');
      await addNoteBtn.click();
      await expect(page.locator('text=Customer contacted via royal concierge').first()).toBeVisible({ timeout: 5000 });
    }

    // 6. View Settings
    await page.click('aside nav a:has-text("Settings")');
    await expect(page).toHaveURL(/\/admin\/settings/);
    await expect(page.locator('h1:has-text("Business & Contact Settings")').first()).toBeVisible();
    await expect(page.locator('input[value*="91"]').first()).toBeVisible();

    // 7. Logout
    const logoutBtn = page.locator('button:has-text("Logout")');
    await logoutBtn.click();

    // Verify redirected back to login
    await expect(page).toHaveURL(/\/admin\/login/, { timeout: 10000 });
  });
});
