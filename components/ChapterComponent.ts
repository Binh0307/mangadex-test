import { Page, Locator } from '@playwright/test';

export class ChapterComponent {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private chapterContainers(): Locator {
    return this.page.locator('[class*="chapter relative"]');
  }

  async clickChapterByNumber(chapterNum: number, lang: string): Promise<void> {
    const chapter = await this.findChapter(chapterNum, lang);
    await chapter.locator('a[title]').first().click();
  }

  async clickChapterByTitle(title: string): Promise<void> {
    const chapter = this.chapterContainers().filter({
      has: this.page.locator(`.chapter-link span`, { hasText: title })
    });
    await chapter.locator('a[title]').first().click();
  }

  async clickComment(chapterNum: number, lang: string): Promise<void> {
    const chapter = await this.findChapter(chapterNum, lang);
    await chapter.locator('.comment-container').click();
  }

  async clickTeam(chapterNum: number, lang: string): Promise<void> {
    const chapter = await this.findChapter(chapterNum, lang);
    await chapter.locator('[class*="group-tag"]').first().click();
  }

  async getTitle(chapterNum: number, lang: string): Promise<string> {
    const chapter = await this.findChapter(chapterNum, lang);
    return chapter.locator('.chapter-link span').innerText();
  }

  private async findChapter(chapterNum: number, lang: string): Promise<Locator> {
    const chapters = this.chapterContainers();
    const count = await chapters.count();

    for (let i = 0; i < count; i++) {
      const chapter = chapters.nth(i);
      const flag = await chapter.locator(`img[title="${lang}"]`).count();
      if (flag) {
        if (chapterNum === 1) return chapter;
        chapterNum--;
      }
    }

    throw new Error(`Chapter number ${chapterNum} with language ${lang} not found`);
  }


  async clickPageNumber(pageNumber: number): Promise<void> {
    const pageBtn = this.page.locator('button', {
      has: this.page.locator('span', { hasText: String(pageNumber) })
    });
    await pageBtn.click();
  }

  async clickNextPage(): Promise<void> {
    const nextBtn = this.page.locator('button', {
      has: this.page.locator('svg.feather-arrow-right')
    });
    await nextBtn.click();
  }

  async clickPreviousPage(): Promise<void> {
    const prevBtn = this.page.locator('button', {
      has: this.page.locator('svg.feather-arrow-left')
    });
    await prevBtn.click();
  }

  async getCurrentPageNumber(): Promise<number> {
    const activeBtn = this.page.locator('button.primary span');
    const text = await activeBtn.innerText();
    return Number(text);
  }

}
