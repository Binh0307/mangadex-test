import { Page, Locator } from '@playwright/test';

export class MangaCard {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private getAllCards(): Locator {
    return this.page.locator('.manga-card');
  }

  private getCardByTitle(title: string): Locator {
    return this.page.locator('.manga-card .title span', { hasText: title }).first().locator('..').locator('..');
  }

  private getTitleLinkByPos(pos: number): Locator {
    return this.getAllCards().nth(pos).locator('a.title');
  }

  private getCoverLinkByPos(pos: number): Locator {
    return this.getAllCards().nth(pos).locator('.manga-card-cover a');
  }

  // ─── Click ─────────────────────────

  async clickByPos(pos: number): Promise<void> {
    const titleLink = this.getTitleLinkByPos(pos);
    const coverLink = this.getCoverLinkByPos(pos);

    if (await titleLink.isVisible()) {
      await titleLink.click();
    } else if (await coverLink.isVisible()) {
      await coverLink.click();
    } else {
      throw new Error(`Card at position ${pos} does not have a clickable title or cover.`);
    }
  }

  async clickByTitle(title: string): Promise<void> {
    const card = this.getCardByTitle(title);
    const titleLink = card.locator('a.title');
    const coverLink = card.locator('.manga-card-cover a');

    if (await titleLink.isVisible()) {
      await titleLink.click();
    } else if (await coverLink.isVisible()) {
      await coverLink.click();
    } else {
      throw new Error(`Card with title "${title}" does not have a clickable title or cover.`);
    }
  }

  // ─── Getters ────────────────────────

  async getTitleByPos(pos: number): Promise<string> {
    return this.getAllCards().nth(pos).locator('.title span').innerText();
  }

  async getTitleByTitle(title: string): Promise<string> {
    return this.page.locator('.manga-card .title span', { hasText: title }).innerText();
  }

  async getAuthorByPos(pos: number): Promise<string> {
    return this.getAllCards().nth(pos).locator('.author a').innerText();
  }

  async getCoverImgByPos(pos: number): Promise<string> {
    return await this.getAllCards().nth(pos).locator('.manga-card-cover img').getAttribute('src') || '';
  }

  async getStatusByPos(pos: number): Promise<string> {
    return this.getAllCards().nth(pos).locator('.status span').last().innerText();
  }

  async getTagsByPos(pos: number): Promise<string[]> {
    return this.getAllCards().nth(pos).locator('.tags-row .tag').allTextContents();
  }

  async getTagsByTitle(title: string): Promise<string[]> {
    const card = this.getCardByTitle(title);
    return card.locator('.tags-row .tag').allTextContents();
  }

  // ─── Utilities ──────────────────────

  async countTitles(): Promise<number> {
    return await this.getAllCards().count();
  }

  async getTitles(): Promise<string[]> {
    const cards = this.getAllCards();
    const count = await cards.count();
    const titles: string[] = [];
    for (let i = 0; i < count; i++) {
      const title = await cards.nth(i).locator('.title span').innerText();
      titles.push(title);
    }
    return titles;
  }

  async verifyTitleExists(title: string): Promise<boolean> {
    return await this.page.locator('.manga-card .title span', { hasText: title }).count() > 0;
  }
}
