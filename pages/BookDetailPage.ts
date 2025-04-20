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
  
    // Open the dropdown
    await dropdown.click();
  
    // Wait for the dropdown menu to appear (it contains role="option")
    const option = this.page.getByRole('option', { name: status, exact: true });
    await option.waitFor({ state: 'visible' });
  
    // Click the desired option
    await option.click();
  
    // Optional: Confirm status updated
    const selected = await dropdown.innerText();
    if (!selected.includes(status)) {
      throw new Error(`Failed to set status to "${status}"`);
    }
  }
  
  
}
