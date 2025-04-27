import { sign } from 'crypto';
import { Page, Locator } from 'playwright';

export enum Section {
    AdvancedSearch = "Advanced Search",
}

export class BasePage {
    page: Page;

    readonly searchInput : Locator

    constructor(page: Page) {   
        this.page = page;
        this.searchInput = page.locator('div').filter({ hasText: /^Show filters$/ }).getByPlaceholder('Search')
    }

    async search(searchTerm: string) {
        await this.searchInput.clear();
        await this.searchInput.fill(searchTerm);
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(2000);
    }

    async goToSection(section: string) {

        //const flag = await this.page.locator('#section-Home').isVisible();
        const flag = await this.page.locator(`.feather-home`).isVisible();
        console.log("🚀 ~ file: BasePage.ts:30 ~ BasePage ~ flag:", flag)
        // if (!flag) {
        //     await this.page.locator(`[aria-label="Open sidebar"]`).click();
        // }

        await this.page.locator('#section-link-_titles').filter({ hasText: section }).click();
    }



    async verifySearch(searchTerm: string) {
        const cards = this.page.locator('.manga-card');
        await cards.first().waitFor({ state: 'visible', timeout: 5000 });
    
        const titles = this.page.locator('.manga-card a.title span');
        const count = await titles.count();
    
        if (count === 0) {
            throw new Error(`❌ No search results found.`);
        }
    
        let matchFound = false;
    
        for (let i = 0; i < count; i++) {
            const titleText = await titles.nth(i).innerText();
    
            if (titleText.toLowerCase().includes(searchTerm.toLowerCase())) {
                matchFound = true;
                console.log(`✅ Found match: "${titleText}"`);
                break;
            }
        }
    
        if (!matchFound) {
            throw new Error(`❌ No titles matched the search term: "${searchTerm}"`);
        }
    }
    

    async checkSignIn() {
        const signInBtn = this.page.getByRole('button', { name: 'Sign in' })
        if(await signInBtn.isVisible()) {
            await signInBtn.click();
            await this.page.waitForTimeout(3000);
        }
    }

    async clickBtn (name) {
        await this.page.getByRole('button', { name: name, exact: true })
    }
    

}