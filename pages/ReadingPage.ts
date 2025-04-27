import { Page } from '@playwright/test';

export class ReadingPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async openMenu(): Promise<void> {
        const menu = this.page.locator('.reader--menu.pinned.header-hidden');
        const isMenuHidden = await menu.isVisible();

        if (isMenuHidden) {
            const metaMenu = this.page.getByText('Menu')
            await metaMenu.click();
        }
    }



    async clickPreviousPage(): Promise<void> {
        const prevBtn = this.page.locator('button', {
            hasText: 'Previous'
        });
        await prevBtn.click();
    }

    // Click the next page button (right arrow)
    async clickNextPage(): Promise<void> {
        const nextBtn = this.page.locator('button', {
            hasText: 'Next'
        });
        await nextBtn.click();
    }

    async getCurrentPageNumber(): Promise<number> {
        const pageNumberSpan = this.page.locator('div[data-v-d2fabe5b] span');
        const currentPageText = await pageNumberSpan.innerText();
        return parseInt(currentPageText, 10);
    }

    async selectPage(pageNumber: number): Promise<void> {
        const pageDropdown = this.page.locator('div[data-v-d2fabe5b]');
        const chevronDown = pageDropdown.locator('svg.feather-chevron-down');

        await chevronDown.click();

        const pageOption = pageDropdown.locator(`li[data-value="${pageNumber - 1}"]`);
        await pageOption.click();
    }

    // --- Chapter Navigation ---
    async clickPreviousChapter(): Promise<void> {
        const prevChapterBtn = this.page.locator('#chapter-selector a:first-child');
        await prevChapterBtn.click();
    }

    async clickNextChapter(): Promise<void> {
        const nextChapterBtn = this.page.locator('#chapter-selector a:last-child');
        await nextChapterBtn.click();
    }

    async getCurrentChapterTitle(): Promise<string> {
        const chapterTitleSpan = this.page.locator('div[data-v-d2fabe5b] span');
        return await chapterTitleSpan.innerText();
    }

    async selectChapter(chapterTitle: string): Promise<void> {
        const chapterDropdown = this.page.locator('#chapter-selector');
        const chevronDown = chapterDropdown.locator('svg.feather-chevron-down');
        await chevronDown.click();

        const chapterOption = chapterDropdown.locator(`li:has-text("${chapterTitle}")`);
        await chapterOption.click();
    }

    async getAvailableChapters(): Promise<string[]> {
        const chapters: string[] = [];
        const chapterDropdown = this.page.locator('#chapter-selector');
        const chapterOptions = chapterDropdown.locator('ul li');

        const count = await chapterOptions.count();
        for (let i = 0; i < count; i++) {
            const chapterOption = chapterOptions.nth(i);
            const chapterTitle = await chapterOption.innerText();
            chapters.push(chapterTitle);
        }

        return chapters;
    }


    async setReadingType(desiredReadingType: 'Long Strip' | 'Single Strip' | 'Single Page' | 'Double Page') {
        const readingTypes = ['Long Strip', 'Single Strip', 'Single Page', 'Double Page'];

        const buttons = this.page.locator('button');

        for (let i = 0; i < await buttons.count(); i++) {
            const button = buttons.nth(i);

            const spanLocator = button.locator('span');
            const spanExists = await spanLocator.count() > 0;
            if (spanExists) {
                let buttonText = await spanLocator.innerText();
                if (readingTypes.includes(buttonText)) {
                    console.log(`Found button with type: ${buttonText}`);

                    while (buttonText !== desiredReadingType) {
                        await button.click(); // Click to change the reading type
                        console.log(`Clicked to change to ${buttonText}`);

                        await this.page.waitForTimeout(500);

                        // Get the updated text of the button
                        const updatedButtonText = await spanLocator.innerText();
                        if (updatedButtonText !== buttonText) {
                            buttonText = updatedButtonText;
                            console.log(`Button text updated to: ${buttonText}`);
                        }
                    }

                    console.log(`Reading type set to: ${desiredReadingType}`);
                    break;
                }
            } else {
                console.log(`Skipping button without <span> element`);
            }
        }
    }


    async waitForLoading(): Promise<void> {
        await this.page.waitForSelector('div.placeholder[data-v-42957336]', { state: 'hidden', timeout: 10000 });
        await this.page.waitForTimeout(3000)
    }
    async verifyImageDisplay() {
        await this.waitForLoading();

        const imageLocator = this.page.locator('img.img');
        const imageCount = await imageLocator.count();

        if (imageCount === 0) {
            throw new Error('No image with class "img ls limit-width" and data-v-7a69fe32 attribute is displayed');
            return false
        }
        return true
    }


}
