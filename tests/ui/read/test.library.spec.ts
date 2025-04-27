import { expect, test } from '@playwright/test'
import { PAGE_URL } from '../../../constant/URL';
import { BasePage, Section } from '../../../pages/BasePage';
import { FilterComponent } from '../../../components/FilterComponent';
import { BookDetailPage } from '../../../pages/BookDetailPage';
import { ReadingPage } from '../../../pages/ReadingPage';
import { MangaCard } from '../../../components/MangaCardComponent';
import { ReadingStatus } from '../../../components/type';

test.describe.serial('Test Library', () => {
    test.use({ storageState: '.auth/user.json' });
    test.setTimeout(600000);

    test.beforeEach(async ({ page }) => {
        
    })

    let title = "INNU - Girl Meets Dog";
    test('User can add a book to library', async ({ page }) => {
        await page.goto(PAGE_URL.BOOK)
        await page.waitForURL(PAGE_URL.BOOK);
        const bookPage = new BookDetailPage(page);
        await page.waitForTimeout(3000);

        await bookPage.btnAddToLibrary.click();
        await page.waitForTimeout(10000);
        await bookPage.btnAddToLibrary.click();
        await bookPage.setReadingStatus('Reading');
        await bookPage.btnSubmitAddToLibrary.click();

        await page.goto(PAGE_URL.LIBRARY);
        await page.waitForURL(PAGE_URL.LIBRARY);
        await page.waitForTimeout(3000);
        
        const mangaCard = new MangaCard(page);
        const titles = await  mangaCard.getTitles();
        console.log("Titles",  titles)
        const author   = await mangaCard.getAuthorByPos(0);
        console.log("Author",  author)

        expect(await mangaCard.verifyTitleExists(title)).toBe(true);
        await page.close();
    })



    test('User can remove a book from library', async ({ page }) => {
        await page.goto(PAGE_URL.LIBRARY)
        await page.waitForURL(PAGE_URL.LIBRARY);
        const bookPage = new BookDetailPage(page);

        await page.waitForTimeout(3000);
        const mangaCard = new MangaCard(page);
        await bookPage.checkSignIn();
        await page.waitForTimeout(3000);
        await mangaCard.clickByTitle(title);
        await page.waitForTimeout(5000);


        await bookPage.clickBtn(ReadingStatus.READING);
        await page.getByRole('button', { name: ReadingStatus.READING }).click();
        await page.waitForTimeout(10000);
        await bookPage.clickBtn(ReadingStatus.READING);
        await bookPage.setReadingStatus('None');
        await bookPage.btnSubmitUpdateToLibrary.click();


        await page.goto(PAGE_URL.LIBRARY);
        await page.waitForURL(PAGE_URL.LIBRARY);
        await page.waitForTimeout(3000);
        expect(await mangaCard.verifyTitleExists(title)).toBe(false);
        await page.close();
    })




})