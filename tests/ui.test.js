const { test, expect } = require("@playwright/test");

const URL = 'http://localhost:3000';
const USER = async (page) => {
    await page.goto(`${URL}/login`);
    await page.locator('#email').fill('peter@abv.bg');
    await page.locator('#password').fill('123456');
    await page.click('input[type="submit"]');
    await page.$('a[href="/catalog"]');
};
const notCreator = async (page) => {
    await page.goto(`${URL}/login`);
    await page.locator('#email').fill('john@abv.bg');
    await page.locator('#password').fill('123456');
    await page.click('input[type="submit"]');
    await page.$('a[href="/catalog"]');
};

test('Verify "All Books" link is visible', async ({ page }) => {
    // Open app
    await page.goto(URL);
    // locate page navbar
    await page.waitForSelector('.navbar');
    const allBooksLink = await page.$('a[href="/catalog"]');
    const isLinkVisible = await allBooksLink.isVisible();
    expect(isLinkVisible).toBe(true);

});
test('Verify "Login" button is visible', async ({ page }) => {
    await page.goto(URL);
    await page.waitForSelector('.navbar');

    const loginBtn = await page.$('a[href="/login"]');
    const isVisible = await loginBtn.isVisible();
    expect(isVisible).toBe(true);
});
test('Verify "Register" button is visible', async ({ page }) => {
    await page.goto(URL);
    await page.waitForSelector('.navbar');

    const registerBtn = await page.$('a[href="/register"]');
    const isVisible = await registerBtn.isVisible();
    expect(isVisible).toBe(true);
});

// User login
test('Verify "All Books" link is visible after login', async ({ page }) => {
    await page.goto(`${URL}/login`);
    await page.locator('#email').fill('peter@abv.bg');
    await page.locator('#password').fill('123456');
    await page.click('input[type="submit"]');
    await page.$('a[href="/catalog"]');
    expect(page.url()).toBe(`${URL}/catalog`);

    const allBooksLink = await page.$('a[href="/catalog"]');
    const isLinkVisible = await allBooksLink.isVisible();
    expect(isLinkVisible).toBe(true);
    // my bookBtn
    const myBooksBtn = await page.$('a[href="/profile"]');
    const isVisible = await myBooksBtn.isVisible();
    expect(isVisible).toBe(true);
    //add Book button
    const addBookBtn = await page.$('a[href="/create"]');
    const isVisibleAddBtn = await addBookBtn.isVisible();
    expect(isVisibleAddBtn).toBe(true);
    //user email is visible

    await expect(page.locator('#user')).toContainText('peter@abv.bg');
});

// Submit the form with empty fields
// login

test('Submit with empty email in login', async ({ page }) => {
    await page.goto(`${URL}/login`);
    await page.locator('#email').fill('');
    let alertMsg = '';
    page.on('dialog', async dialog => {
        alertMsg = dialog.message();
        await dialog.accept();
    });
    await page.click('input[type="submit"]');
    await page.waitForTimeout(2000);
    expect(alertMsg).toBe('All fields are required!');


});
// register
test('Submit with empty email in register', async ({ page }) => {
    await page.goto(`${URL}/register`);
    await page.locator('#email').fill('');
    let alertMsg = '';
    page.on('dialog', async dialog => {
        alertMsg = dialog.message();
        await dialog.accept();
    });
    await page.click('input[type="submit"]');
    await page.waitForTimeout(2000);
    expect(alertMsg).toBe('All fields are required!');


});
// Submit empty password
// login
test('Submit with empty password in login', async ({ page }) => {
    await page.goto(`${URL}/login`);
    await page.locator('#password').fill('');
    let alertMsg = '';
    page.on('dialog', async dialog => {
        alertMsg = dialog.message();
        await dialog.accept();
    });
    await page.click('input[type="submit"]');

    await page.waitForTimeout(2000);
    expect(alertMsg).toBe('All fields are required!');
});
//register
test('Submit with empty password in register', async ({ page }) => {
    await page.goto(`${URL}/register`);
    await page.locator('#password').fill('');
    let alertMsg = '';
    page.on('dialog', async dialog => {
        alertMsg = dialog.message();
        await dialog.accept();
    });
    await page.click('input[type="submit"]');

    await page.waitForTimeout(2000);
    expect(alertMsg).toBe('All fields are required!');
});
// password don't match
test('Register - re-pass don\'t match', async ({ page }) => {
    await page.goto(`${URL}/register`);
    await page.locator('#email').fill('peter@abv.bg');
    await page.locator('#password').fill('1111');
    await page.locator('#repeat-pass').fill('1');
    let alertMsg = '';
    page.on('dialog', async dialog => {
        alertMsg = dialog.message();
        await dialog.accept();
    });
    await page.click('input[type="submit"]');

    expect(alertMsg).toBe('Passwords don\'t match!');
    //expect(alertMsg).toBe('All fields are required!');

});
test('Register - pass & re-pass are empty', async ({ page }) => {
    await page.goto(`${URL}/register`);
    await page.locator('#email').fill('peter@abv.bg');
    await page.locator('#password').fill('');
    await page.locator('#repeat-pass').fill('');
    let alertMsg = '';
    page.on('dialog', async dialog => {
        alertMsg = dialog.message();
        await dialog.accept();
    });
    await page.click('input[type="submit"]');
    expect(alertMsg).toBe('All fields are required!');

});
// *** 'ADD BOOK' Page ***
// submit with correct data
test('Add book with correct data', async ({ page }) => {
    await page.goto(`${URL}/login`);
    await page.locator('#email').fill('peter@abv.bg');
    await page.locator('#password').fill('123456');

    await Promise.all([
        page.click('input[type="submit"]'),
        page.waitForURL(`${URL}/catalog`)

    ]);
    expect(page.url()).toBe(`${URL}/catalog`);


    await page.click('a[href="/create"]');
    await page.waitForSelector('#create-form');

    await page.fill('#title', "Test Name");
    await page.fill('#description', "Some info");
    await page.fill('#image', "https://example.com/book-image.jpg");
    await page.selectOption('#type', "Mistery");

    await page.click('#create-form input[type="submit"]');
    await page.waitForURL(`${URL}/catalog`);
    expect(page.url()).toBe(`${URL}/catalog`);
});
// Submit with empty fields
test('Add book with empty fields', async ({ page }) => {
    await USER(page);
    await page.click('a[href="/create"]');
    await page.waitForSelector('#create-form');
    // empty title
    await page.fill('#description', "Some info");
    await page.fill('#image', "https://example.com/book-image.jpg");
    await page.selectOption('#type', "Mistery");

    page.on('dialog', async dialog => {
        expect(dialog.type()).toBe('alert');
        expect(dialog.message()).toBe('All fields are required!');
        await dialog.accept();
    });

    await page.$('a[href="/create"]');
    expect(page.url()).toBe(`${URL}/create`);
    await page.locator("#description").clear();
    await page.locator("#image").clear();

    // Empty description
    await page.fill('#title', " name");
    await page.fill('#image', "https://example.com/book-image.jpg");
    await page.selectOption('#type', "Mistery");

    page.on('dialog', async dialog => {
        expect(dialog.type()).toBe('alert');
        expect(dialog.message()).toBe('All fields are required!');
        await dialog.accept();
    });

    await page.$('a[href="/create"]');
    expect(page.url()).toBe(`${URL}/create`);
    await page.locator("#title").clear();
    await page.locator("#image").clear();

    //emty image
    await page.fill('#title', "test2");
    await page.fill('#description', "Some text");
    await page.selectOption('#type', "Mistery");

    page.on('dialog', async dialog => {
        expect(dialog.type()).toBe('alert');
        expect(dialog.message()).toBe('All fields are required!');
        await dialog.accept();
    });

    await page.$('a[href="/create"]');
    expect(page.url()).toBe(`${URL}/create`);
    await page.locator("#title").clear();
    await page.locator("#description").clear();

});
// *** 'ALL BOOK' Page ***
// verify if there are books
test('Verify all book are displayed', async ({ page }) => {
    await USER(page);

    await page.waitForSelector('#dashboard-page');
    const allBooks = await page.$$('.other-books-list li');
    expect(allBooks.length).toBeGreaterThan(0);
});
// Veryfy if there are no books
test('Verify if there are no books', async ({ page }) => {
    await USER(page);

    await page.click('a[href="/profile"]');
    await page.waitForSelector('#my-books-page');
    const noBooks = await page.textContent('.no-books');
    expect(noBooks).toBe('No books in database!');
});
// *** 'Details' page ***
test('Detail page with my book', async ({ page }) => {
    await USER(page);
    await page.waitForSelector('#dashboard-page');

    await page.click('.other-books-list li:nth-child(2) .button');
    await page.waitForSelector('#details-page .book-information');

    const bookName = await page.textContent('.book-information h3');
    expect(bookName).toBe('Outlander');

    const editBtn = await page.textContent('.actions > a');
    expect(editBtn).toBe('Edit');
    const delBtn = await page.textContent('.actions > a:nth-child(2)');
    expect(delBtn).toBe('Delete');
    const btns = await page.$$('.actions a');
    expect(btns.length).toBe(2);

});
// Verify If Edit and Delete Buttons Are Not Visible for Non-Creator
test('Verify If Edit and Delete Buttons Are Not Visible for Non-Creator', async ({ page }) => {
    await notCreator(page);
    await page.click('.other-books-list li:nth-child(2) .button');
    await page.waitForSelector('#details-page .book-information');
    const likeBtn = await page.textContent('.actions > a');
    expect(likeBtn).toBe('Like');
    const btns = await page.$$('.actions a');
    expect(btns.length).toBe(1);
});

// Verify That Guest User Sees Details Button and Button Works Correctly
test('Verify That Guest User Sees Details Button and Button Works Correctly', async ({ page }) => {
    await page.goto(`${URL}`);
    await page.waitForSelector('.navbar');
    await page.click('a[href="/catalog"]');
    const detailBtn = await page.waitForSelector('.other-books-list .button');
    const btn = await detailBtn.isVisible();
    expect(btn).toBe(true);


});