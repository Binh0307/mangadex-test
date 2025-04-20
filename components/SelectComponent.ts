import { Locator, Page } from 'playwright';

export class SelectComponent {
    page: Page;
    wrapper: Locator;
    button: Locator;
    options: Locator;

    constructor(page: Page, wrapperSelector: string) {
        this.page = page;
        this.wrapper = page.locator(wrapperSelector);
        this.button = this.wrapper.locator('button');
        this.options = this.wrapper.locator('ul[role="listbox"] > li');
    }

    // Open the dropdown
    async open() {
        await this.button.click();
    }

    // Select multiple options
    async selectOptions(options: string[]) {
        await this.open();
        for (const option of options) {
            await this.options.locator(`text=${option}`).click();
        }
    }

    // Get all available options
    async getOptions() {
        const optionTexts = await this.options.allTextContents();
        return optionTexts;
    }

    // Get selected options
    async getSelectedOptions() {
        const selectedOptions = await this.wrapper.locator('span').allTextContents();
        return selectedOptions;
    }
}
