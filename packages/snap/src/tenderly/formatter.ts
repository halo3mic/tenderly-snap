import { panel, text, heading, Panel, divider, Component } from '@metamask/snaps-ui';

import { arrMakeUnique, makeAddressFormatters } from './utils';
import { TenderlyCredentials } from './credentials-access';


export function formatResponse(data: any, credentials: TenderlyCredentials): Panel {
    const formatters = makeAddressFormatters(data);
  
    let panelOutputs = [
        ...formatBalanceDiff(data, formatters),
        divider(), divider(),
        ...formatOutputValue(data, formatters),
        divider(), divider(),
        ...formatStorageChanges(data, formatters),
        divider(), divider(),
        ...formatEventLogs(data, formatters),
        divider(), divider(),
        ...formatCallTrace(data),
        divider(), divider(),
        ...formatSimulationUrl(data, credentials)
    ];
  
    return panel(panelOutputs);
}

function formatBalanceDiff(data: any, { formatAddress }: any): Component[] {
    const panelOutputs: Component[] = [ heading('Balance changes:') ];
    const callTrace = data.transaction.transaction_info.call_trace;

    if (!callTrace.balance_diff) {
        panelOutputs.push(text('No balance changes'))
        return panelOutputs;
    }

    callTrace.balance_diff
        .forEach(
        (balance: any) => {
            const accountLabel = balance.is_miner ? 'BlockProducer' : formatAddress(balance.address);
            panelOutputs.push(text(`**${accountLabel}**: ${(balance.dirty - balance.original)/1e18} ETH`))
        }            
    )

    return panelOutputs;
}

function formatOutputValue(data: any, { formatAddressesWithinStr }: any): Component[] {
    const panelOutputs: Component[] = [heading('Output value:')];
    const callTrace = data.transaction.transaction_info.call_trace;

    if (!callTrace.output) {
        panelOutputs.push(text('No output value'));
        return panelOutputs;
    }

    if (callTrace.decoded_output) {
        callTrace.decoded_output
            .forEach(
                (output: any) => {
                    const formattedValue = formatAddressesWithinStr(JSON.stringify(output.value))
                    panelOutputs.push(text(`${output.soltype.name}[${output.soltype.type}] = ${formattedValue}`))
                }
            )
    } else {
        panelOutputs.push(text(callTrace.output))
    }

    return panelOutputs;
}

function formatStorageChanges(data: any, formatters: any): Component[] {
    const { formatAddress, formatAddressesWithinStr } = formatters;
    const panelOutputs: Component[] = [ heading('Storage Changes:') ];
    const stateDiff = data.transaction.transaction_info.state_diff;

    if (!stateDiff) {
        panelOutputs.push(text('No storage changes'))
        return panelOutputs;
    }

    const uniqueContracts = arrMakeUnique(stateDiff.map((d: any) => d.address));
        uniqueContracts.forEach(contract => {
            panelOutputs.push(divider());
            panelOutputs.push(text(`**➤ ${formatAddress(contract)}**`));

            let storageChanges = stateDiff.filter((d: any) => d.address == contract)
            console.log("storageChanges", JSON.stringify(storageChanges, null, 2))
            storageChanges.forEach((diff: any) => {
                // todo: support raw format here!
                if (diff.soltype)
                    panelOutputs.push(text(`▸ **${diff.soltype.name}[${diff.soltype.type}]:**`));
                let formattedOriginal = formatAddressesWithinStr(JSON.stringify(diff.original));
                let formattedDirty = formatAddressesWithinStr(JSON.stringify(diff.dirty));
                panelOutputs.push(text(`${formattedOriginal} => ${formattedDirty}`))
            })
        })

    return panelOutputs;
}

function formatEventLogs(data: any, formatters: any): Component[] {
    const { formatAddress, formatAddressesWithinStr } = formatters;
    const panelOutputs: Component[] = [ heading('Event logs:') ];
    const logs = data.transaction.transaction_info.call_trace?.logs;

    if (!logs) {
        panelOutputs.push(text('No event logs'))
        return panelOutputs;
    }

    logs.forEach((log: any) => {
        if (log.name) {
            panelOutputs.push(divider());
            panelOutputs.push(text(`**➤ ${formatAddress(log.raw.address)}::${log.name}**`));
            log.inputs.forEach((input: any) => {
                panelOutputs.push(text(`▸ **${input.soltype.name}[${input.soltype.type}]:** ${formatAddressesWithinStr(JSON.stringify(input.value))}`));
            });
        } else {
            panelOutputs.push(text(`**Address:** ${log.raw.address}`));
            panelOutputs.push(text(`**Topics:** ${log.raw.topics}`));
            panelOutputs.push(text(`**Data:** ${log.raw.data}`));
        }    
    });

    return panelOutputs;
}

function formatCallTrace(data: any): Component[] {

    function formatCallsRecursive(calls: any, iter=0): Component[] {
        let lines: Component[] = [];
        calls.forEach((call: any) => {
            const tab = '|'.repeat(iter)
            const contract = call.contract_name || call.to;
            const method = call.function_name || call.input.slice(0, 10)
            const line = text(`|${tab}↳  **${contract}::${method}**`);

            lines = call.calls 
                ? [...lines, line, ...formatCallsRecursive(call.calls, iter+4)]
                : [...lines, line];
        })
        return lines;
    }

    const calls = data.transaction.transaction_info.call_trace?.calls;
    if (!calls) {
        return [heading('Call trace:'), text('No call trace')];
    }
    const panelOutputs: Component[] = [ 
        heading('Call trace:'),
        ...formatCallsRecursive(calls)
    ];

    return panelOutputs;
}

function formatSimulationUrl(data: any, credentials: TenderlyCredentials): Component[] {
    const simulationUrl = `https://dashboard.tenderly.co/${credentials.userId}/${credentials.projectId}/simulator/${data.simulation.id}`
    const panelOutputs: Component[] = [ 
        heading('Tenderly Dashboard:'), 
        text('See full simulation details in Tenderly.'),
        text(`**${simulationUrl}**`),
    ];

    return panelOutputs;
}