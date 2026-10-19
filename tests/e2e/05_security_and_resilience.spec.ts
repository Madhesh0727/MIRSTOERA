import { test, expect } from '@playwright/test';

test.describe('E2E Suite 5 — Security Headers & Resilience Verification', () => {
  test('Direct unauthenticated request to /api/admin/dashboard returns 401 Unauthorized', async ({ request }) => {
    const res = await request.get('/api/admin/dashboard');
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('UNAUTHORIZED');
  });

  test('Direct unauthenticated request to /api/admin/enquiries returns 401 Unauthorized', async ({ request }) => {
    const res = await request.get('/api/admin/enquiries');
    expect(res.status()).toBe(401);
  });

  test('Public API responses do not expose sensitive stack traces or internal server variables', async ({ request }) => {
    // Malformed JSON request to enquiries
    const res = await request.post('/api/enquiries', {
      data: { invalid_field: 'malicious' },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    // Should NOT expose stack trace
    expect(body.stack).toBeUndefined();
    expect(JSON.stringify(body)).not.toContain('node_modules');
    expect(JSON.stringify(body)).not.toContain('/home/');
  });

  test('XSS script payloads submitted in booking description do not execute and are rendered safely as text', async ({ page }) => {
    // Dialog listener to detect if any alert/confirm/prompt is triggered
    let dialogTriggered = false;
    page.on('dialog', async (dialog) => {
      dialogTriggered = true;
      await dialog.dismiss();
    });

    await page.goto('/book?service=secret-gift');

    await page.fill('input#customer_name', 'Audit Security User');
    await page.fill('input#customer_phone', '9876543210');

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);
    await page.fill('input#event_date', futureDate.toISOString().split('T')[0]);

    await page.fill('input#event_time', '18:30');
    await page.selectOption('select#event_area', { index: 1 });
    await page.selectOption('select#recipient_relationship', { index: 1 });

    // Inject script payload into description
    await page.fill(
      'textarea#description, textarea[name="description"]',
      '<script>alert("xss-exploit")</script><img src="x" onerror="alert(1)">'
    );

    const consentCheckbox = page.locator('input#privacy_consent, input[name="privacy_consent"]');
    await consentCheckbox.check();

    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    await expect(
      page.locator('h1:has-text("Your Royal Request Has Been Received!")').first()
    ).toBeVisible({ timeout: 10000 });

    // Assert that no alert dialog popped up
    expect(dialogTriggered).toBe(false);
  });
});
