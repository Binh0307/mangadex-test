import { test } from '@playwright/test'
import { PAGE_URL } from '../../../constant/URL';
import { BasePage, Section } from '../../../pages/BasePage';
import { FilterComponent } from '../../../components/FilterComponent';
import { BookDetailPage } from '../../../pages/BookDetailPage';
import { ReadingPage } from '../../../pages/ReadingPage';

test.describe('Read', () => {
    //test.use({ storageState: '.auth/user.json' });
    test.setTimeout(600000);

    test.beforeEach(async ({ page }) => {
        await page.goto(PAGE_URL.BOOK)
        await page.waitForURL(PAGE_URL.BOOK);
    })

    test('Book detail ', async ({ page }) => {
        const bookPage = new BookDetailPage(page);
        //await page.waitForTimeout(3000);
        await bookPage.waitForLoading();

        const authors = await bookPage.getAuthors();
        console.log("authors:", authors)
        const artists = await bookPage.getArtists();
        console.log("artists:", artists)
        const genres = await bookPage.getGenres();
        console.log("genres:", genres)
        const themes = await bookPage.getThemes();
        console.log("themes:", themes)
        const demographics = await bookPage.getDemographics();
        console.log("demographics:", demographics)
        await bookPage.verifyDisplay()

        await page.close();
    })

    test('User can read a chapter', async ({ page }) => {
        const bookPage = new BookDetailPage(page);
        await bookPage.waitForLoading();
        await bookPage.chapter.clickChapterByNumber(2, 'Vietnamese');
        await page.close();

    })




    test('User can read comment', async ({ page }) => {
        const bookPage = new BookDetailPage(page);
        await page.waitForTimeout(3000);
        await bookPage.chapter.clickComment(1, 'Vietnamese');

        await page.waitForTimeout(3000);
        await bookPage.verifyCommentDisplay();

        await page.close();
    })


    test('User can read book', async ({ page }) => {
        const bookPage = new BookDetailPage(page);
        await bookPage.verifyDisplay();

        const title = await bookPage.chapter.getTitle(2, 'Vietnamese');

        console.log("Tilte: ", title);
        await bookPage.chapter.clickChapterByNumber(2, 'Vietnamese');
        const readPage = new ReadingPage(page);
        await readPage.waitForLoading();
        await readPage.verifyImageDisplay();

        await page.close();
    })

    test('User can change reading type', async ({ page }) => {
        const bookPage = new BookDetailPage(page);
        await bookPage.waitForLoading();

        const title = await bookPage.chapter.getTitle(2, 'Vietnamese');

        console.log("Tilte: ", title);
        const readPage = new ReadingPage(page);
        await bookPage.chapter.clickChapterByNumber(2, 'Vietnamese');
        await readPage.waitForLoading();

        await readPage.openMenu();
        await readPage.waitForLoading();

        await readPage.setReadingType('Long Strip');
        await readPage.waitForLoading();

        await readPage.clickNextChapter();
        await readPage.waitForLoading();


        const chapters = await readPage.getAvailableChapters();
        console.log("Chapters: ", chapters);

        await page.close();
    })

    test('User can switch chapter', async ({ page }) => {
        const bookPage = new BookDetailPage(page);
        await bookPage.waitForLoading();

        const title = await bookPage.chapter.getTitle(2, 'Vietnamese');

        console.log("Tilte: ", title);
        await bookPage.chapter.clickChapterByNumber(2, 'Vietnamese');
        const readPage = new ReadingPage(page);
        await readPage.waitForLoading();


        await readPage.clickNextChapter();
        await readPage.waitForLoading();

        const chapters = await readPage.getAvailableChapters();
        console.log("Chapters: ", chapters);

        await page.close();
    })


})