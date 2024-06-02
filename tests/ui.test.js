const { test, expect } = require("@playwright/test");

test('Verify "All Books" link is visible', async ({ page }) => {
    await page.goto('http://localhost:3000');
});