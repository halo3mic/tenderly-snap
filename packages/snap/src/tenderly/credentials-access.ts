import { panel, text, heading } from '@metamask/snaps-ui';
import { requestPrompt } from './utils';

export interface TenderlyCredentials {
    projectId: string;
    userId: string;
    accessKey: string;
}

export async function fetchCredentials(origin: string): Promise<TenderlyCredentials | null> {
    const persistedData: any = await snap.request({
        method: 'snap_manageState',
        params: { operation: 'get' },
    });
    console.log('persistedData', JSON.stringify(persistedData))

    if (!persistedData) {
        handleUpdateTenderlyCredentials(origin);
        return null;
    }
    return persistedData;
}

export async function handleUpdateTenderlyCredentials(origin: string) {
    const tenderlyAccess = await requestNewTenderlyCredentials(origin);
    console.log('tenderlyAccess', JSON.stringify(tenderlyAccess))
    await snap.request({
        method: 'snap_manageState',
        params: { operation: 'update', newState: tenderlyAccess }
    });
}

async function requestNewTenderlyCredentials(origin: string): Promise<TenderlyCredentials> {
    const credentialsRaw = await requestCredentials(origin);
    if (!credentialsRaw)
        throw new Error('Request for new Tenderly access failed; missing input');

    const [ newUserId, newProjectId, newAccessKey ] = credentialsRaw.split('@');
    if (!newUserId || !newProjectId || !newAccessKey)
        throw new Error('Request for new Tenderly access failed; invalid input');

    return {
        projectId: newProjectId,
        accessKey: newAccessKey,
        userId: newUserId,
    };
}

async function requestCredentials(origin: string): Promise<string | null> {
    return requestPrompt(
        panel([
            heading(`${origin} wants to update the Tenderly credentials`),
            text('Enter your Tenderly credentials in format:'),
            text('**{user_id}@{project_id}@{access_key}**'),
        ]),
        'mark@my-project@BwY3p6f2r85049-AF5TPA2cr'
    );
}