import { Chance } from 'chance';
import { rte } from '../../../helpers/constants';
import { acceptLicenseTermsAndAddDatabase, deleteDatabase } from '../../../helpers/database';
import { BrowserPage, CliPage } from '../../../pageObjects';
import {
    commonUrl,
    ossStandaloneConfig
} from '../../../helpers/conf';

const browserPage = new BrowserPage();
const cliPage = new CliPage();
const chance = new Chance();

let keyName = chance.word({ length: 20 });
let consumerGroupName = chance.word({ length: 20 });

fixture `Acknowledge and Claim of Pending messages`
    .meta({ type: 'critical_path', rte: rte.standalone })
    .page(commonUrl)
    .beforeEach(async() => {
        await acceptLicenseTermsAndAddDatabase(ossStandaloneConfig, ossStandaloneConfig.databaseName);
    })
    .afterEach(async t => {
        //Clear and delete database
        if (await t.expect(browserPage.closeKeyButton.visible).ok()){
            await t.click(browserPage.closeKeyButton);
        }
        await browserPage.deleteKeyByName(keyName);
        await deleteDatabase(ossStandaloneConfig.databaseName);
    });
test('Verify that user can acknowledge any message in the list of pending messages', async t => {
    keyName = chance.word({ length: 20 });
    consumerGroupName = chance.word({ length: 20 });
    const cliCommands = [
        `XGROUP CREATE ${keyName} ${consumerGroupName} $ MKSTREAM`,
        `XADD ${keyName} * message apple`,
        `XREADGROUP GROUP ${consumerGroupName} Alice COUNT 1 STREAMS ${keyName} >`
    ];
    // Add New Stream Key with pending message
    for(const command of cliCommands){
        await cliPage.sendCommandInCli(command);
    }
    // Open Stream pendings view
    await browserPage.openStreamPendingsView(keyName);
    await t.click(browserPage.fullScreenModeButton);
    // Acknowledge message and check result
    await t.click(browserPage.acknowledgeButton);
    await t.expect(browserPage.confirmationMessagePopover.textContent).contains('will be acknowledged and removed from the pending messages list', 'The confirmation message');
    await t.click(browserPage.confirmAcknowledgeButton);
    await t.expect(browserPage.streamMessagesContainer.textContent).contains('Your Consumer has no pending messages.', 'The messages is acknowledged from the table');
});
test('Verify that user can claim any message in the list of pending messages', async t => {
    keyName = chance.word({ length: 20 });
    consumerGroupName = chance.word({ length: 20 });
    const cliCommands = [
        `XGROUP CREATE ${keyName} ${consumerGroupName} $ MKSTREAM`,
        `XADD ${keyName} * message apple`,
        `XADD ${keyName} * message orange`,
        `XREADGROUP GROUP ${consumerGroupName} Alice COUNT 1 STREAMS ${keyName} >`,
        `XREADGROUP GROUP ${consumerGroupName} Bob COUNT 1 STREAMS ${keyName} >`
    ];
    // Add New Stream Key with pending message
    for(const command of cliCommands){
        await cliPage.sendCommandInCli(command);
    }
    // Open Stream pendings view
    await browserPage.openStreamPendingsView(keyName);
    await t.click(browserPage.fullScreenModeButton);
    // Claim message and check result
    await t.click(browserPage.claimPendingMessageButton);
    await t.expect(browserPage.pendingCount.textContent).eql('pending: 1', 'The number of pending messages for selected consumer');
    await t.click(browserPage.submitButton);
    await t.expect(browserPage.streamMessagesContainer.textContent).contains('Your Consumer has no pending messages.', 'The messages is claimed and removed from the table');
    await t.click(browserPage.streamTabConsumers);
    await t.click(browserPage.streamConsumerName.nth(1));
    await t.expect(browserPage.streamMessage.count).eql(2, 'The claimed messages is in the selected Consumer');
});
