import { test } from '@playwright/test'
import { PAGE_URL } from '../../../constant/URL';
import { BasePage, Section } from '../../../pages/BasePage';
import { FilterComponent } from '../../../components/FilterComponent';
import { BookDetailPage } from '../../../pages/BookDetailPage';
import { ReadingPage } from '../../../pages/ReadingPage';
import { MDListPage } from '../../../pages/MDListPage';
import { generateRandomString } from '../../../ultis/random';

test.describe.serial('MD List', () => {
    test.use({ storageState: '.auth/user.json' });
    test.setTimeout(600000);

    test.beforeEach(async ({ page }) => {
        await page.goto(PAGE_URL.MDLIST)
        await page.waitForURL(PAGE_URL.MDLIST);
    })

    const mdlistTitle = generateRandomString(10);
    test('User can create a new MD List', async ({ page }) => {

        const mdListPage = new MDListPage(page);
        await page.waitForTimeout(1000)
        await mdListPage.checkSignIn();

        await mdListPage.addMDList(mdlistTitle);
        await mdListPage.verifyMDList(mdlistTitle);

        await page.close();
    })

    test('User can add title to MD List', async ({ page }) => {
        const mdListPage = new MDListPage(page);

        await page.waitForTimeout(1000)
        await mdListPage.checkSignIn();

        //await mdListPage.clickMDList(mdlistTitle);
        await mdListPage.clickMDList("name");
        const titles = await mdListPage.addItemToMDList('naruto', 0);
        await mdListPage.verifyItemInMDList(titles);

        await page.close();
    }) 

    test('User can remove title from MD List', async ({ page }) => {
        const mdListPage = new MDListPage(page);
        await page.waitForTimeout(1000)
        await mdListPage.checkSignIn();


        //await mdListPage.clickMDList(mdlistTitle);
        await mdListPage.clickMDList("name");
        const removedTitle = await mdListPage.removeItemFromMDListByPos( 0);
        await mdListPage.verifyItemInMDList([removedTitle||''], false);

        await page.close();
    })

    test('User can delete a MD List', async ({ page }) => {
        const mdListPage = new MDListPage(page);

        await page.waitForTimeout(1000)
        await mdListPage.checkSignIn();


        //await mdListPage.clickMDList(mdlistTitle);
        const removedTitle = await mdListPage.removeItemFromMDListByPos( 0);
        await mdListPage.verifyItemInMDList([removedTitle||''], false);
        await mdListPage.verifyMDList(mdlistTitle, false);

        await page.close();
    })

})