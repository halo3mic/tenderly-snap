import { OnRpcRequestHandler, OnTransactionHandler } from '@metamask/snaps-types';
import { isObject, hasProperty } from '@metamask/utils';
import { NodeType } from '@metamask/snaps-ui';

import { handleUpdateTenderlyCredentials } from './tenderly/credentials-access';
import { simulate } from './tenderly/simulation';


export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }) => {
    if (request.method === 'update_tenderly_credentials')
        return handleUpdateTenderlyCredentials(origin)
    throw new Error(`Method ${request.method} not supported.`)
};

export const onTransaction: OnTransactionHandler = async ({transaction, transactionOrigin}) => {
    if (
        !isObject(transaction) ||
        !hasProperty(transaction, 'data') ||
        typeof transaction.data !== 'string'
    ) {
        return { content: { value: "Unknown tx type", type: NodeType.Text } }
    }
    const simulationResponse = await simulate(transaction, transactionOrigin);
    return {
        content: { children: simulationResponse.children, type: NodeType.Panel }
    };
}