import { Page, Locator } from 'playwright';
import { SelectComponent } from './SelectComponent';

export class FilterComponent {
    page: Page;
    wrapper: Locator;

    sortBy: SelectComponent;
    filterTags: SelectComponent;
    contentRating: SelectComponent;
    magazineDemographic: SelectComponent;
    authors: SelectComponent;
    artists: SelectComponent;
    languages: SelectComponent;
    publicationStatus: SelectComponent;

    constructor(page: Page, wrapperSelector: string) {
        this.page = page;
        this.wrapper = page.locator(wrapperSelector);

        // Initialize each filter as a SelectComponent using the appropriate string selector
        this.sortBy = new SelectComponent(page, 'div#headlessui-listbox-button-v-0-1-210');
        this.filterTags = new SelectComponent(page, 'div#headlessui-popover-button-v-0-1-212');
        this.contentRating = new SelectComponent(page, 'div#headlessui-listbox-button-v-0-1-218');
        this.magazineDemographic = new SelectComponent(page, 'div#headlessui-listbox-button-v-0-1-221');
        this.authors = new SelectComponent(page, 'div#headlessui-listbox-button-v-0-1-224');
        this.artists = new SelectComponent(page, 'div#headlessui-listbox-button-v-0-1-227');
        this.languages = new SelectComponent(page, 'div#headlessui-listbox-button-v-0-1-230');
        this.publicationStatus = new SelectComponent(page, 'div#headlessui-listbox-button-v-0-1-233');
    }

    // Methods to interact with each filter
    async selectSortBy(options: string[]) {
        await this.sortBy.selectOptions(options);
    }

    async selectFilterTags(options: string[]) {
        await this.filterTags.selectOptions(options);
    }

    async selectContentRating(options: string[]) {
        await this.contentRating.selectOptions(options);
    }

    async selectMagazineDemographic(options: string[]) {
        await this.magazineDemographic.selectOptions(options);
    }

    async selectAuthors(options: string[]) {
        await this.authors.selectOptions(options);
    }

    async selectArtists(options: string[]) {
        await this.artists.selectOptions(options);
    }

    async selectLanguages(options: string[]) {
        await this.languages.selectOptions(options);
    }

    async selectPublicationStatus(options: string[]) {
        await this.publicationStatus.selectOptions(options);
    }

    // Methods to get selected options
    async getSelectedSortBy() {
        return await this.sortBy.getSelectedOptions();
    }

    async getSelectedFilterTags() {
        return await this.filterTags.getSelectedOptions();
    }

    async getSelectedContentRating() {
        return await this.contentRating.getSelectedOptions();
    }

    async getSelectedMagazineDemographic() {
        return await this.magazineDemographic.getSelectedOptions();
    }

    async getSelectedAuthors() {
        return await this.authors.getSelectedOptions();
    }

    async getSelectedArtists() {
        return await this.artists.getSelectedOptions();
    }

    async getSelectedLanguages() {
        return await this.languages.getSelectedOptions();
    }

    async getSelectedPublicationStatus() {
        return await this.publicationStatus.getSelectedOptions();
    }

    // Methods to get all options for a specific filter
    async getAllSortByOptions() {
        return await this.sortBy.getOptions();
    }

    async getAllFilterTagsOptions() {
        return await this.filterTags.getOptions();
    }

    async getAllContentRatingOptions() {
        return await this.contentRating.getOptions();
    }

    async getAllMagazineDemographicOptions() {
        return await this.magazineDemographic.getOptions();
    }

    async getAllAuthorsOptions() {
        return await this.authors.getOptions();
    }

    async getAllArtistsOptions() {
        return await this.artists.getOptions();
    }

    async getAllLanguagesOptions() {
        return await this.languages.getOptions();
    }

    async getAllPublicationStatusOptions() {
        return await this.publicationStatus.getOptions();
    }
}
