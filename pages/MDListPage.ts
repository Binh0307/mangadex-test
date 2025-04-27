import { Page, Locator } from '@playwright/test';
import { ChapterComponent } from '../components/ChapterComponent';
import { BasePage } from './BasePage';

export class MDListPage extends BasePage {
    readonly page: Page;
    readonly btnAddMDList : Locator
    readonly btnEdit: Locator
    readonly btnAddTitle: Locator
    readonly searchInput: Locator;


    readonly btnMore: Locator
    constructor(page: Page) {
        super(page);
        this.page = page;
        this.btnAddMDList = this.page.locator('a.md-btn[data-v-6495c397][data-v-7272a4ca]')
        this.btnMore = this.page.getByRole('button', { name: 'More' });
        this.btnEdit = this.page.getByRole('link', { name: 'Edit' })
        this.btnAddTitle = this.page.getByText('Add title');
        this.searchInput = this.page.locator('form.md-inputwrap input[name="q"]');

    }

    async addMDList(title: string) {
        await this.btnAddMDList.click();
        await this.page.locator('input[title="MDList name"]').fill(title);
        await this.page.getByRole('button', { name: 'Create' }).click();
    }

    async verifyMDList(title: string, isExist: boolean = true): Promise<boolean> {
        if (isExist) {
            return await this.page.getByText(title).first().isVisible();
        } else {
            return !await this.page.getByText(title).first().isVisible();
        }
    }

    async clickMDList(title: string) {
        await this.page.locator('.manga__list .list__name').filter({ hasText: title }).click();
    }

    
    async addByPos(pos: number) {
        await this.page.locator('.add-wrap .add-buttons').nth(pos).click();
        return (await this.page.locator('.add-wrap').nth(pos).locator('span.font-bold.title').innerText()).trim();
    }

    async addItemToMDList(title: string, number: number) { 
        await this.btnMore.click();
        await this.btnEdit.click();
        await this.btnAddTitle.click();
        await this.searchInput.fill(title);
        const titles : string[] = []

        for(let i = 0; i < number; i++) {
            titles.push(await this.addByPos(i))
        }

        return titles
    }

    async verifyItemInMDList(title: string[], isExist: boolean = true): Promise<boolean> {
        for (let i = 0; i < title.length; i++) {
            const locator = this.page.getByText(title[i], { exact: false });
            const isVisible = await locator.isVisible().catch(() => false);
    
            if (isExist && !isVisible) {
                return false;
            } else if (!isExist && isVisible) {
                return false;
            }
        }
        return true;
    }
    
    async deleteMDListByPos(pos: number): Promise<string> {
        const listRoot = this.page.locator('.manga__list').nth(pos);
        const titleLocator = listRoot.locator('.list__name a');
        const title = await titleLocator.innerText();
    
        const menuButton = listRoot.locator('.md-context-menu button').first();
        await menuButton.click();
    
        const deleteBtn = this.page.getByRole('button', { name: 'Delete' });
        await deleteBtn.waitFor({ state: 'visible' });
        await deleteBtn.click();
    
        return title;
    }
    

    async removeItemFromMDList(titles: string[]) {
        for (const title of titles) {
            const coverWrappers = await this.page.$$('div[data-v-dc1688dd][style*="padding-bottom"]');
    
            for (const wrapper of coverWrappers) {
                const titleElement = await wrapper.$('span.subtitle');
                const textContent = await titleElement?.innerText();
    
                if (textContent?.toLowerCase().includes(title.toLowerCase())) {
                    const removeButton = await wrapper.$('button.danger');
                    if (removeButton) {
                        await removeButton.click();
                        break;
                    }
                }
            }
        }
    }

    async removeItemFromMDListByPos(pos: number): Promise<string | null> {
        const coverWrappers = await this.page.$$('div[data-v-dc1688dd][style*="padding-bottom"]');
    
        if (pos < 0 || pos >= coverWrappers.length) {
            throw new Error(`Invalid position: ${pos}. Total items: ${coverWrappers.length}`);
        }
    
        const target = coverWrappers[pos];
    
        const titleElement = await target.$('span.subtitle');
        const title = await titleElement?.innerText();
    
        const removeButton = await target.$('button.danger');
        if (removeButton) {
            await removeButton.click();
        } else {
            throw new Error(`Remove button not found for item at position ${pos}`);
        }
    
        return title ?? null;
    }
    
    

}
