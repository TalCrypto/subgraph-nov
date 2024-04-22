import { Address } from '@graphprotocol/graph-ts'

const CHARSET =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')


function decodeBase62ToBigInt(str: string): bigint {
  return str
    .split('')
    .reverse()
    .reduce((acc, char, index) => {
      const value = BigInt(CHARSET.indexOf(char))
      return acc + value * BigInt(62) ** BigInt(index)
    }, BigInt(0))
}

export function base62ToHex(base62: string): Address {
  const bigint = decodeBase62ToBigInt(base62)
  return Address.fromHexString('0x' + bigint.toString(16))
}
