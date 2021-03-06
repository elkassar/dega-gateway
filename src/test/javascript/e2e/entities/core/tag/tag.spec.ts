/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../../page-objects/jhi-page-objects';

import { TagComponentsPage, TagDeleteDialog, TagUpdatePage } from './tag.page-object';

const expect = chai.expect;

describe('Tag e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let tagUpdatePage: TagUpdatePage;
    let tagComponentsPage: TagComponentsPage;
    let tagDeleteDialog: TagDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.loginWithOAuth('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Tags', async () => {
        await navBarPage.goToEntity('tag');
        tagComponentsPage = new TagComponentsPage();
        expect(await tagComponentsPage.getTitle()).to.eq('gatewayApp.coreTag.home.title');
    });

    it('should load create Tag page', async () => {
        await tagComponentsPage.clickOnCreateButton();
        tagUpdatePage = new TagUpdatePage();
        expect(await tagUpdatePage.getPageTitle()).to.eq('gatewayApp.coreTag.home.createOrEditLabel');
        await tagUpdatePage.cancel();
    });

    it('should create and save Tags', async () => {
        const nbButtonsBeforeCreate = await tagComponentsPage.countDeleteButtons();

        await tagComponentsPage.clickOnCreateButton();
        await promise.all([
            tagUpdatePage.setNameInput('name'),
            tagUpdatePage.setSlugInput('slug'),
            tagUpdatePage.setDescriptionInput('description'),
            tagUpdatePage.setClientIdInput('clientId'),
            tagUpdatePage.setCreatedDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
            tagUpdatePage.setLastUpdatedDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM')
        ]);
        expect(await tagUpdatePage.getNameInput()).to.eq('name');
        expect(await tagUpdatePage.getSlugInput()).to.eq('slug');
        expect(await tagUpdatePage.getDescriptionInput()).to.eq('description');
        expect(await tagUpdatePage.getClientIdInput()).to.eq('clientId');
        expect(await tagUpdatePage.getCreatedDateInput()).to.contain('2001-01-01T02:30');
        expect(await tagUpdatePage.getLastUpdatedDateInput()).to.contain('2001-01-01T02:30');
        await tagUpdatePage.save();
        expect(await tagUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await tagComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last Tag', async () => {
        const nbButtonsBeforeDelete = await tagComponentsPage.countDeleteButtons();
        await tagComponentsPage.clickOnLastDeleteButton();

        tagDeleteDialog = new TagDeleteDialog();
        expect(await tagDeleteDialog.getDialogTitle()).to.eq('gatewayApp.coreTag.delete.question');
        await tagDeleteDialog.clickOnConfirmButton();

        expect(await tagComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});
