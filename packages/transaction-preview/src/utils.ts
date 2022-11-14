import type { DeviceNotBrowser, TransactionObject } from './types'
import bowser from 'bowser'
import type {
  Device,
  DeviceBrowser,
  DeviceOS,
  DeviceType
} from '@web3-onboard/common'

/**
 * Takes in TransactionRequest and converts all Hex values to numbers
 * @param transaction
 * @returns a transaction where all Hex properties are now numbers
 */
export const hexFieldsToNumber = (
  transaction: TransactionObject
): TransactionRequestWithNumberFields =>
  Object.keys(transaction).reduce(
    (transaction, txnProperty) => ({
      ...transaction,
      ...(typeof transaction[txnProperty as keyof TransactionObject] ===
        'string' &&
      (transaction[txnProperty as keyof TransactionObject] as string).includes(
        '0x'
      ) &&
      txnProperty !== 'to' &&
      txnProperty !== 'input' &&
      txnProperty !== 'data' &&
      txnProperty !== 'from'
        ? {
            [txnProperty]: parseInt(
              transaction[txnProperty as keyof TransactionObject] as string,
              16
            )
          }
        : {})
    }),
    transaction
  ) as TransactionRequestWithNumberFields

type TransactionRequestWithNumberFields = TransactionObject & {
  gas: number
  value: number
  gasPrice?: number
  maxPriorityFeePerGas?: number
  maxFeePerGas?: number
}

export function getDevice(): Device | DeviceNotBrowser {
  if (typeof window !== 'undefined') {
    const parsed = bowser.getParser(window.navigator.userAgent)
    const os = parsed.getOS()
    const browser = parsed.getBrowser()
    const { type } = parsed.getPlatform()

    return {
      type: type as DeviceType,
      os: os as DeviceOS,
      browser: browser as DeviceBrowser
    }
  } else {
    return {
      type: null,
      os: null,
      browser: null
    }
  }
}