import { test } from '@playwright/test'
import { PAGE_URL } from '../../../constant/URL';
import { BasePage, Section } from '../../../pages/BasePage';
import { FilterComponent } from '../../../components/FilterComponent';

test.describe('Search', () => {
    //test.use({ storageState: '.auth/user.json' });

    test.beforeEach(async ({ page }) => {
        await page.goto(PAGE_URL.BASE_URL)
    })

    test('search', async ({ page }) => {
        const basePage = new BasePage(page);

        await basePage.goToSection(Section.AdvancedSearch);
        await basePage.search('naruto');
        await basePage.verifySearch('naruto');

        await page.close();
    })

    test('Test Filter', async ({ page }) => {
        const basePage = new BasePage(page);

        await basePage.goToSection(Section.AdvancedSearch);

        const filter = new FilterComponent(page, '');
        await page.locator('button', { hasText: 'Show filters' }).click();
        await filter.selectFilterTags(['Action', 'Comedy'])
        await page.waitForTimeout(5000);
        await page.locator('button', { hasText: 'Search' }).click();

        await page.waitForTimeout(5000);
        await basePage.verifySearch('');


        await page.close();
    })
})