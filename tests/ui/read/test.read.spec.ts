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
        await page.goto("https://mangadex.org/title/2ae16e3d-f4de-4604-bb72-63dc7e16359d/innu-girl-meets-dog")
        await page.waitForURL("https://mangadex.org/title/2ae16e3d-f4de-4604-bb72-63dc7e16359d/innu-girl-meets-dog");
    })

    test('All details in book detail', async ({ page }) => {
        const bookPage = new BookDetailPage(page);
        await page.waitForTimeout(3000);

        const authors = await bookPage.getAuthors();
        console.log("🚀 ~ file: test.read.spec.ts:17 ~ test ~ authors:",  authors)
        const artists = await bookPage.getArtists();
        console.log("🚀 ~ file: test.read.spec.ts:19 ~ test ~ artists:",  artists)
        const genres = await bookPage.getGenres();
        console.log("🚀 ~ file: test.read.spec.ts:21 ~ test ~ genres:",  genres)
        const themes = await bookPage.getThemes();
        console.log("🚀 ~ file: test.read.spec.ts:23 ~ test ~ themes:",  themes)
        const demographics = await bookPage.getDemographics();
        console.log("🚀 ~ file: test.read.spec.ts:25 ~ test ~ demographics:",  demographics)
        const externalLinks = await bookPage.getExternalLinks();
        console.log("🚀 ~ file: test.read.spec.ts:27 ~ test ~ externalLinks:",  externalLinks)

        await page.close();
    })

    test('User can read a chapter', async ({ page }) => {
        const bookPage = new BookDetailPage(page);
        await page.waitForTimeout(3000);
        await bookPage.chapter.clickChapterByNumber(2, 'Vietnamese');
        await page.close();

    })

    test('User can change reading type', async ({ page }) => {
        const bookPage = new BookDetailPage(page);
        await page.waitForTimeout(3000);
        await bookPage.chapter.clickChapterByNumber(2, 'Vietnamese');

        const readPage = new ReadingPage(page);
        await readPage.openMenu();
        await page.waitForTimeout(3000);

        await readPage.setReadingType('Long Strip');
        await page.waitForTimeout(3000);
        await page.close();
    })

    test('User can switch chapter', async ({ page }) => {
        const bookPage = new BookDetailPage(page);
        await page.waitForTimeout(3000);
        await bookPage.chapter.clickChapterByNumber(1, 'Vietnamese');

        const readPage = new ReadingPage(page);
        await readPage.openMenu();
        await page.waitForTimeout(3000);

        await readPage.clickNextChapter();
        await page.waitForTimeout(3000);
        await page.close();
    })


    test('User can read comment', async ({ page }) => {
        const bookPage = new BookDetailPage(page);
        await page.waitForTimeout(3000);
        await bookPage.chapter.clickComment(1, 'Vietnamese');

        await page.waitForTimeout(3000);

        await page.close();
    })




    test('Book Detail Read', async ({ page }) => {
        const bookPage = new BookDetailPage(page);
        await page.waitForTimeout(5000);


        const title = await bookPage.chapter.getTitle(2, 'Vietnamese');

        console.log("Tilte: ", title);
        await bookPage.chapter.clickChapterByNumber(2, 'Vietnamese');
        await page.waitForTimeout(3000);


        const readPage = new ReadingPage(page);
        await readPage.openMenu();
        await page.waitForTimeout(3000);

        await readPage.setReadingType('Long Strip');
        await page.waitForTimeout(3000);


        await readPage.clickNextChapter();
        await page.waitForTimeout(3000);
        
        const chapters = await readPage.getAvailableChapters();
        console.log("Chapters: ", chapters);

        await page.close();
    })

})