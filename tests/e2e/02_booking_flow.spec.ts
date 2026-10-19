import { test, expect } from '@playwright/test';

test.describe('E2E Suite 2 — Customer Experience Booking & Validation', () => {
  test('Pre-selects service from URL query parameter in booking form', async ({ page }) => {
    await page.goto('/book?service=hero-entry');

    // Verify service select is preselected with Cinematic Hero Entry
    const serviceSelect = page.locator('select#service_slug, select[name="service_slug"]');
    await expect(serviceSelect).toBeVisible();

    const selectedValue = await serviceSelect.inputValue();
    expect(selectedValue).toBe('hero-entry');

    // Dynamic price preview shows ₹1,299
    await expect(page.locator('text=₹1,299').first()).toBeVisible();
  });

  test('Validates required fields when submitted empty', async ({ page }) => {
    await page.goto('/book');

    // Click submit button directly
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    // Verify error messages appear for mandatory fields
    await expect(page.locator('text=/Name must be at least 2 characters/i').first()).toBeVisible();
    await expect(page.locator('text=/Please enter a valid phone number/i').first()).toBeVisible();
  });

  test('Rejects invalid phone number format', async ({ page }) => {
    await page.goto('/book');

    const phoneInput = page.locator('input#customer_phone, input[name="customer_phone"]');
    await phoneInput.fill('12345'); // Invalid 5-digit number

    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    await expect(page.locator('text=/Please enter a valid phone number/i').first()).toBeVisible();
  });

  test('Completes valid booking journey and renders confirmation with WhatsApp Concierge', async ({ page }) => {
    await page.goto('/book?service=birthday-surprise');

    // Fill customer info
    await page.fill('input#customer_name', 'Prince Raghav');
    await page.fill('input#customer_phone', '9876543210');

    // Pick a date 10 days in future (YYYY-MM-DD)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);
    const dateStr = futureDate.toISOString().split('T')[0];
    await page.fill('input#event_date', dateStr);

    // Fill event time (input type="time")
    await page.fill('input#event_time', '18:30');

    // Pick event area
    await page.selectOption('select#event_area', { index: 1 });

    // Recipient & Details
    await page.selectOption('select#recipient_relationship', { index: 1 });
    await page.fill(
      'textarea#description, textarea[name="description"]',
      'Grand royal birthday entrance with trumpet fanfare and custom parchment decree.'
    );

    // Check privacy consent checkbox
    const consentCheckbox = page.locator('input#privacy_consent, input[name="privacy_consent"]');
    await consentCheckbox.check();

    // Submit enquiry
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    // Verify submission succeeds and renders Royal Confirmation
    await expect(
      page.locator('h1:has-text("Your Royal Request Has Been Received!")').first()
    ).toBeVisible({ timeout: 10000 });

    // Verify Reference Code format MIR-XXXXXX is displayed
    const refCodeLocator = page.locator('text=/MIR-\\d{6}/');
    await expect(refCodeLocator.first()).toBeVisible();
    const refCode = await refCodeLocator.first().innerText();
    expect(refCode).toMatch(/MIR-\d{6}/);

    // Verify Direct WhatsApp Concierge button exists with wa.me link
    const waButton = page.locator('a[href*="wa.me"]');
    await expect(waButton.first()).toBeVisible();
    const waHref = await waButton.first().getAttribute('href');
    expect(waHref).toContain('wa.me');
  });
});
