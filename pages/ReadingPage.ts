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
            hasText: 'Previous' // You can refine this selector by checking for the button structure.
        });
        await prevBtn.click();
    }

    // Click the next page button (right arrow)
    async clickNextPage(): Promise<void> {
        const nextBtn = this.page.locator('button', {
            hasText: 'Next' // Adjust text or selector as needed to identify the next button.
        });
        await nextBtn.click();
    }

    // Get the current page number from the page selector dropdown
    async getCurrentPageNumber(): Promise<number> {
        const pageNumberSpan = this.page.locator('div[data-v-d2fabe5b] span');
        const currentPageText = await pageNumberSpan.innerText();
        return parseInt(currentPageText, 10);
    }

    // Select a specific page from the dropdown
    async selectPage(pageNumber: number): Promise<void> {
        const pageDropdown = this.page.locator('div[data-v-d2fabe5b]');
        const chevronDown = pageDropdown.locator('svg.feather-chevron-down');

        // Open the dropdown
        await chevronDown.click();

        // Select the page option by its value
        const pageOption = pageDropdown.locator(`li[data-value="${pageNumber - 1}"]`);
        await pageOption.click();
    }

    // --- Chapter Navigation ---

    // Click the previous chapter button (left arrow)
    async clickPreviousChapter(): Promise<void> {
        const prevChapterBtn = this.page.locator('#chapter-selector a:first-child');
        await prevChapterBtn.click();
    }

    // Click the next chapter button (right arrow)
    async clickNextChapter(): Promise<void> {
        const nextChapterBtn = this.page.locator('#chapter-selector a:last-child');
        await nextChapterBtn.click();
    }

    // Get the current chapter title
    async getCurrentChapterTitle(): Promise<string> {
        const chapterTitleSpan = this.page.locator('div[data-v-d2fabe5b] span');
        return await chapterTitleSpan.innerText();
    }

    // Select a chapter by its title
    async selectChapter(chapterTitle: string): Promise<void> {
        const chapterDropdown = this.page.locator('#chapter-selector');
        const chevronDown = chapterDropdown.locator('svg.feather-chevron-down');

        // Open the chapter dropdown
        await chevronDown.click();

        // Select the chapter by its visible title
        const chapterOption = chapterDropdown.locator(`li:has-text("${chapterTitle}")`);
        await chapterOption.click();
    }

    // Get a list of all available chapters in the dropdown
    // Get a list of all available chapters in the dropdown
    async getAvailableChapters(): Promise<string[]> {
        const chapters: string[] = []; // Explicitly define the type of the array
        const chapterDropdown = this.page.locator('#chapter-selector');
        const chapterOptions = chapterDropdown.locator('ul li');

        const count = await chapterOptions.count();
        for (let i = 0; i < count; i++) {
            const chapterOption = chapterOptions.nth(i);
            const chapterTitle = await chapterOption.innerText();
            chapters.push(chapterTitle); // Now this should work as the array is typed as string[]
        }

        return chapters;
    }


    async setReadingType(desiredReadingType: 'Long Strip' | 'Single Strip' | 'Single Page' | 'Double Page') {
        const readingTypes = ['Long Strip', 'Single Strip', 'Single Page', 'Double Page'];

        // Find all buttons on the page
        const buttons = this.page.locator('button');

        // Loop through all buttons
        for (let i = 0; i < await buttons.count(); i++) {
            const button = buttons.nth(i);

            // Check if the button has a <span> element
            const spanLocator = button.locator('span');
            const spanExists = await spanLocator.count() > 0;

            // If it has a <span>, get the text inside the <span>
            if (spanExists) {
                let buttonText = await spanLocator.innerText();

                // Check if this button contains one of the reading types
                if (readingTypes.includes(buttonText)) {
                    console.log(`Found button with type: ${buttonText}`);

                    // Click the button until it matches the desired reading type
                    while (buttonText !== desiredReadingType) {
                        await button.click(); // Click to change the reading type
                        console.log(`Clicked to change to ${buttonText}`);

                        // Wait for the button text to update (optional: a small delay to ensure the text updates)
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





}
