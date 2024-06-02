const { test, expect } = require("@playwright/test");

test('Verify "All Books" link is visible', async ({ page }) => {
    // Open app
    await page.goto('http://localhost:3000');
    // locate page navbar
    await page.waitForSelector('.navbar');
    const allBooksLink = await page.$('a[href="/catalog"]');
    const isLinkVisible = await allBooksLink.isVisible();
    expect(isLinkVisible).toBe(true);

});