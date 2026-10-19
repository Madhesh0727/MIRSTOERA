import { test, expect } from '@playwright/test';

const BREAKPOINTS = [
  { name: 'Mobile 320px', width: 320, height: 600 },
  { name: 'Mobile 375px', width: 375, height: 667 },
  { name: 'Tablet 768px', width: 768, height: 1024 },
  { name: 'Desktop 1024px', width: 1024, height: 768 },
  { name: 'Large Desktop 1440px', width: 1440, height: 900 },
];

const PAGES_TO_TEST = ['/', '/experiences', '/book', '/our-story', '/contact', '/privacy', '/terms'];

test.describe('E2E Suite 4 — Responsive Layout & Zero Horizontal Overflow', () => {
  for (const bp of BREAKPOINTS) {
    test(`Zero horizontal overflow on ${bp.name} (${bp.width}x${bp.height})`, async ({ page }) => {
      await page.setViewportSize({ width: bp.width, height: bp.height });

      for (const route of PAGES_TO_TEST) {
        await page.goto(route);
        await page.waitForLoadState('domcontentloaded');

        // Check if page body/html scrolls horizontally
        const isOverflowing = await page.evaluate(() => {
          return document.documentElement.scrollWidth > window.innerWidth;
        });

        expect(
          isOverflowing,
          `Page ${route} has horizontal overflow at viewport ${bp.width}px (scrollWidth: ${await page.evaluate(() => document.documentElement.scrollWidth)})`
        ).toBe(false);
      }
    });
  }
});
