import { Page, Locator } from '@playwright/test';
import { ChapterComponent } from '../components/ChapterComponent';
import { BasePage } from './BasePage';

export class BookDetailPage extends BasePage {
  readonly page: Page;

  readonly authorTags: Locator;
  readonly artistTags: Locator;
  readonly genreTags: Locator;
  readonly themeTags: Locator;
  readonly demographicTags: Locator;
  readonly externalLinks: Locator;

  readonly btnAddToLibrary: Locator
  readonly btnSubmitAddToLibrary: Locator
  readonly btnSubmitUpdateToLibrary: Locator

  readonly chapter: ChapterComponent;

  constructor(page: Page) {
    super(page);
    this.page = page;

    this.authorTags = this.sectionTags('Author');
    this.artistTags = this.sectionTags('Artist');
    this.genreTags = this.sectionTags('Genres');
    this.themeTags = this.sectionTags('Themes');
    this.demographicTags = this.sectionTags('Demographic');
    this.externalLinks = this.sectionTags('Read or Buy');


    this.btnAddToLibrary = this.page.getByRole('button', { name: 'Add To Library' })
    this.btnSubmitAddToLibrary = this.page.getByRole('button', { name: 'Add', exact: true })
    this.btnSubmitUpdateToLibrary = this.page.getByRole('button', { name: 'Update', exact: true })

    this.chapter = new ChapterComponent(page);

  }

  private sectionTags(label: string): Locator {
    return this.page.locator(`div.mb-2:has(div.font-bold:has-text("${label}")) >> a.tag span`);
  }

  async waitForLoading(): Promise<void> {
    await this.page.waitForSelector('svg.spinner', { state: 'hidden' });
    await this.page.waitForTimeout(3000)
  }


  async getAuthors(): Promise<string[]> {
    const authorSection = this.page.locator('div.font-bold.mb-2', { hasText: 'Author' }).locator('..');
    const authors = await authorSection.locator('a.tag span').allTextContents();
    return [...new Set(authors)]; // Remove duplicates
  }

  async getArtists(): Promise<string[]> {
    const artistSection = this.page.locator('div.font-bold.mb-2', { hasText: 'Artist' }).locator('..');
    const artists = await artistSection.locator('a.tag span').allTextContents();
    return [...new Set(artists)]; // Remove duplicates
  }

  async getGenres(): Promise<string[]> {
    return this.genreTags.allTextContents();
  }

  async getThemes(): Promise<string[]> {
    return this.themeTags.allTextContents();
  }

  async getDemographics(): Promise<string[]> {
    return this.demographicTags.allTextContents();
  }

  async getExternalLinks(): Promise<{ text: string, href: string }[]> {
    const tags = this.page.locator(`div.mb-2:has(div.font-bold:has-text("Read or Buy")) >> a.tag`);
    const handles = await tags.elementHandles();
    return Promise.all(handles.map(async el => ({
      text: (await el.textContent())?.trim() || '',
      href: await el.getAttribute('href') || ''
    })));
  }

  async goToExternalLink(linkText: string): Promise<void> {
    const link = this.page.locator(`div.mb-2:has(div.font-bold:has-text("Read or Buy")) >> a.tag`, { hasText: linkText });
    await link.first().click();
  }


  async setReadingStatus(status: string) {
    const dropdown = this.page.locator('.md-select:has-text("Reading Status")');

    await dropdown.click();

    const option = this.page.getByRole('option', { name: status, exact: true });
    await option.waitFor({ state: 'visible' });

    // Click the desired option
    await option.click();

    const selected = await dropdown.innerText();
    if (!selected.includes(status)) {
      throw new Error(`Failed to set status to "${status}"`);
    }
  }

  async verifyDisplay(): Promise<void> {
    await this.waitForLoading();

    const tagSections = [
      { name: 'Author', locator: this.authorTags },
      { name: 'Artist', locator: this.artistTags },
      { name: 'Genres', locator: this.genreTags },
      { name: 'Themes', locator: this.themeTags },
      { name: 'Demographic', locator: this.demographicTags },
    ];

    for (const section of tagSections) {
      const count = await section.locator.count();
      if (count === 0) {
        throw new Error(`${section.name} tags are not displayed or empty`);
      }
    }

    const externalLinksCount = await this.externalLinks.count();
    if (externalLinksCount === 0) {
      throw new Error('External links are not displayed or empty');
    }


  }

  async verifyCommentDisplay() {
    await this.waitForLoading();

    const imageLocator = this.page.locator('.message-cell');
    const imageCount = await imageLocator.count();
    if (imageCount === 0) {
      return false
    }
    return true

  }
}
