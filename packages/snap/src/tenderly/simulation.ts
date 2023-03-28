import { panel, text, Panel, divider } from '@metamask/snaps-ui';
import { Json } from '@metamask/utils';

import { TenderlyCredentials, fetchCredentials } from './credentials-access';
import { formatResponse } from './formatter';
import { hex2int } from './utils';


export async function simulate(
    transaction: { [key: string]: Json;}, 
    transactionOrigin: any
): Promise<Panel> {
    const credentials = await fetchCredentials(transactionOrigin)
    if (!credentials)
      return panel([text('🚨 Tenderly access key updated. Please try again.')])
  
    const simulationResponse = await submitSimulation(transaction, credentials);
    let err = catchError(simulationResponse);
    
    return err ? err : formatResponse(simulationResponse, credentials);  
}

async function submitSimulation(
    transaction: { [key: string]: Json;},
    credentials: TenderlyCredentials
) {
    const chainId = await ethereum.request({ method: 'eth_chainId' });
    const response = await fetch(
        `https://api.tenderly.co/api/v1/account/${credentials.userId}/project/${credentials.projectId}/simulate`,
        {
        method: 'POST', 
        body: JSON.stringify({
            from: transaction.from,
            to: transaction.to,
            input: transaction.data,
            gas: hex2int(transaction.gas),
            value: hex2int(transaction.value),
            gas_price: hex2int(transaction.maxFeePerGas),
            network_id: hex2int(chainId as string),
            save: true,
            save_if_fails: true,
            simulation_type: 'full',
            generate_access_list: false,
        }),
        headers: {
            'Content-Type': 'application/json',
            'X-Access-Key': credentials.accessKey
        }
        }
    );
    return response.json();
}

function catchError(data: any): Panel | null {
    if (!data.transaction) {
        if (data.error) {
        return panel([
            text(`**❌ ${data.error.slug}:**`), 
            divider(), 
            text(data.error.message)
        ])
        }
        return panel([text('Invalid response 😬')])
    } else if (data.transaction.error_info) {
        return panel([
            text(`**❌ Error in ${data.transaction.error_info.address}:**`),
            divider(),
            text(data.transaction.error_info.error_message)
        ])
    }
    return null;
}
  