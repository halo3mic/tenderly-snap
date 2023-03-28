import { defaultSnapOrigin } from '../config';
import { GetSnapsResponse, Snap } from '../types';

/**
 * Get the installed snaps in MetaMask.
 *
 * @returns The snaps installed in MetaMask.
 */
export const getSnaps = async (): Promise<GetSnapsResponse> => {
  return (await window.ethereum.request({
    method: 'wallet_getSnaps',
  })) as unknown as GetSnapsResponse;
};

/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
export const connectSnap = async (
  snapId: string = defaultSnapOrigin,
  params: Record<'version' | string, unknown> = {},
) => {
  await window.ethereum.request({
    method: 'wallet_requestSnaps',
    params: {
      [snapId]: params,
    },
  });
};

/**
 * Get the snap from MetaMask.
 *
 * @param version - The version of the snap to install (optional).
 * @returns The snap object returned by the extension.
 */
export const getSnap = async (version?: string): Promise<Snap | undefined> => {
  try {
    const snaps = await getSnaps();

    return Object.values(snaps).find(
      (snap) =>
        snap.id === defaultSnapOrigin && (!version || snap.version === version),
    );
  } catch (e) {
    console.log('Failed to obtain installed snap', e);
    return undefined;
  }
};

/**
 * Invoke the "hello" method from the example snap.
 */

export const sendOkTx = async () => {
  try {
    const [ from ] = await window.ethereum.request({
      method: 'eth_requestAccounts'
    }) as string[];

    if (!from) {
      throw new Error("Failed to get an account")
    }

    window.ethereum.request({
      method: 'eth_sendTransaction', 
      params: [{
        from: from, 
        to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // weth
        value: '0x38d7ea4c68000', // 0.001 ETH
        data: '0xd0e30db0', // deposit()
      }]
    })
  } catch (e) {
    console.error(e)
  }

};

export const sendFailTx = async () => {
  try {
    const [ from ] = await window.ethereum.request({
      method: 'eth_requestAccounts'
    }) as string[];

    if (!from) {
      throw new Error("Failed to get an account")
    }

    window.ethereum.request({
      method: 'eth_sendTransaction', 
      params: [{
        from: from, 
        to: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d', 
        data: '0x7ff36ab500000000000000000000000000000000000000000000000020db126a4f5828de0000000000000000000000000000000000000000000000000000000000000080000000000000000000000000064c63d32a11f66667be5f67148e2b589eff822b0000000000000000000000000000000000000000000000000000017a7de19bc10000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000007d1afa7b718fb893db30a3abc0cfc608aacfebb0'
      }]
    })
  } catch (e) {
    console.error(e)
  }

};

export const updateAccessKey = async () => {
  await window.ethereum.request({
      method: 'wallet_invokeSnap',
      params: { snapId: defaultSnapOrigin, request: { method: 'update_tenderly_credentials' } },
    });
};

export const isLocalSnap = (snapId: string) => snapId.startsWith('local:');
