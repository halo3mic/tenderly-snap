import { Panel } from '@metamask/snaps-ui';
import { Json } from '@metamask/utils';


export function hex2int(hex: string | Json): number | null {
    return hex ? parseInt(hex.toString(), 16) : null;
}

export function strReplaceAll(o: string, s: string, r: string): string {
    return o.replace(new RegExp(s, "g"), r);
}

export function arrMakeUnique(arr: any[]): any[] {
    return [...new Set(arr)];
}

export async function requestPrompt(
    content: Panel,
    placeholder: string
): Promise<string | null> {
    const res = await snap.request({
        method: 'snap_dialog',
        params: {
        type: 'Prompt',
        content,
        placeholder,
        },
    });
    return res ? res.toString() : null;
}

export function makeAddressFormatters(data: any) {
    const { transaction } = data;
    let accountLabels= new Map<string, string>();
  
    accountLabels.set(transaction.from.toLowerCase(), 'TxOrigin');
    for (let contract of data.contracts)
        accountLabels.set(contract.address.toLowerCase(), contract.contract_name);
    if (transaction.to) {
        const recvLabel = accountLabels.get(transaction.to.toLowerCase());
        accountLabels.set(
            transaction.to.toLowerCase(), 
            (recvLabel ? recvLabel+'|' : '') + 'TxRecipient'
        );
    }
    
    const formatAddress = (a: string) => accountLabels.get(a.toLowerCase()) || a;
    const formatAddressesWithinStr = (val: string) => {
        val = val.toLowerCase();
        for (let [address, label] of accountLabels.entries()) {
            val = strReplaceAll(val, address, label);
        }
        return val;
    }
  
    return { formatAddress, formatAddressesWithinStr };
}