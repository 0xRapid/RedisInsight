import { t } from 'testcafe';
import { RdiInstancePage } from '../../../../pageObjects/rdi-instance-page';
import { AddNewRdiParameters, RdiApiRequests } from '../../../../helpers/api/api-rdi';
import { commonUrl } from '../../../../helpers/conf';
import { MyRedisDatabasePage } from '../../../../pageObjects';
import { RdiTemplatePipelineType, RedisOverviewPage } from '../../../../helpers/constants';
import { RdiInstancesListPage } from '../../../../pageObjects/rdi-instances-list-page';
import { BrowserActions } from '../../../../common-actions/browser-actions';
import { DatabaseHelper } from '../../../../helpers';
import { MonacoEditor } from '../../../../common-actions/monaco-editor';

const rdiInstancePage = new RdiInstancePage();
const rdiApiRequests = new RdiApiRequests();
const myRedisDatabasePage = new MyRedisDatabasePage();
const rdiInstancesListPage = new RdiInstancesListPage();
const browserActions = new BrowserActions();
const databaseHelper = new DatabaseHelper();

const rdiInstance: AddNewRdiParameters = {
    name: 'testInstance',
    url: 'http://localhost:4000',
    username: 'username',
    password: 'password'
};

//skip the tests until rdi integration is added
fixture.skip `Add job`
    .meta({ type: 'critical_path' })
    .page(commonUrl)
    .beforeEach(async() => {
        await databaseHelper.acceptLicenseTerms();
        await myRedisDatabasePage.setActivePage(RedisOverviewPage.Rdi);
        await rdiApiRequests.addNewRdiApi(rdiInstance);
        await rdiInstancesListPage.reloadPage();
        await rdiInstancesListPage.clickRdiByName(rdiInstance.name);

    })
    .afterEach(async() => {
        await rdiApiRequests.deleteAllRdiApi();
    });
test('Verify that user can add, edit and delete job', async() => {
    const jobName = 'testJob';
    const jobName2 = 'testJob2';

    await t.click(rdiInstancePage.addJobBtn);

    const placeholder =  await rdiInstancePage.jobNameInput.getAttribute('placeholder');

    await t.expect(placeholder).eql('Enter job name');

    await t
        .expect(rdiInstancePage.applyJobNameBtn.hasAttribute('disabled')).ok('the button is not disabled');
    await t.hover(rdiInstancePage.applyJobNameBtn);
    await browserActions.verifyTooltipContainsText('Job name is required', true);

    await t.click(rdiInstancePage.cancelJobNameBtn);
    await rdiInstancePage.addJob(jobName);

    const elementItem = await rdiInstancePage.jobItem.count;
    await t.expect(elementItem).gt(0, 'The job is not added');

    await t.click(rdiInstancePage.addJobBtn);
    await t.typeText(rdiInstancePage.jobNameInput, jobName);
    await t
        .expect(rdiInstancePage.applyJobNameBtn.hasAttribute('disabled')).ok('the button is not disabled');
    await t.hover(rdiInstancePage.applyJobNameBtn);
    await browserActions.verifyTooltipContainsText('Job name is already in use', true);
    await t.click(rdiInstancePage.cancelJobNameBtn);

    await rdiInstancePage.addJob(jobName2);
    let elementItem2 = await rdiInstancePage.jobItem.count;
    await t.expect(elementItem + 1).eql(elementItem2, 'the 2d job has not be added');

    await rdiInstancePage.deleteJobByName(jobName2);
    elementItem2 = await rdiInstancePage.jobItem.count;
    await t.expect(elementItem).eql(elementItem2, 'the 2d job has not be deleted');

    await rdiInstancePage.editJobByName(jobName, jobName2);
    await rdiInstancePage.openJobByName(jobName2);

    await t.expect(rdiInstancePage.jobsPipelineTitle.textContent).eql(jobName2);
});

test('Verify that user insert template for jobs', async() => {
    const jobName = 'testJob';
    const disabledAttribute = 'isDisabled';
    const defaultValue = 'Ingest';
    const templateWords = 'server_name: chinook';
    // should be empty config
    await rdiInstancePage.addJob(jobName);

    await t.expect(rdiInstancePage.templateApplyButton.visible).ok('the template popover is not expanded');
    const buttonClass = rdiInstancePage.templateApplyButton.getAttribute('class');
    await t.expect(buttonClass).notContains(disabledAttribute, 'Apply button is disabled');
    await t.click(rdiInstancePage.templateCancelButton);
    await t.expect(rdiInstancePage.templateApplyButton.exists).notOk('the template popover is not closed');

    await t.click(rdiInstancePage.templateButton);
    await t.expect(rdiInstancePage.templateApplyButton.visible).ok('the template popover is not expanded');
    await t.expect(rdiInstancePage.pipelineDropdown.textContent).eql(defaultValue, 'the default value is set incorrectly');
    await rdiInstancePage.setTemplateDropdownValue(RdiTemplatePipelineType.WriteBehind);

    //verify uniq templates words - should be undated when templates are added
    const enteredText = await MonacoEditor.getTextFromMonaco();
    await t.expect(enteredText).contains(templateWords, 'template is incorrect');

    await t.click(rdiInstancePage.templateButton);
    await t.expect(buttonClass).contains(disabledAttribute, 'Apply button is active');
    await t.expect(rdiInstancePage.pipelineDropdown.textContent).eql('Write behind', 'the value is set incorrectly');
});

