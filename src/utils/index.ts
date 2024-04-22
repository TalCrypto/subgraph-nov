import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { ELPoint, Referral, UserBalance, UserPoint } from "../../generated/schema";

export function getUserBalance(user: Address): UserBalance {
  let userBalance = UserBalance.load(user);
  if (userBalance == null) {
    userBalance = new UserBalance(user);
    userBalance.balance = BigInt.fromU32(0);
  }
  return userBalance;
}

export function getUserPoint(user: Address): UserPoint {
  let userPoint = UserPoint.load(user);
  if (userPoint == null) {
    userPoint = new UserPoint(user);
    userPoint.point = BigInt.fromU32(0);
    userPoint.lastUpdatedTimestamp = BigInt.fromU32(0);
  }
  return userPoint;
}

export function saveReferral(referralId: string): void {
    let referral = Referral.load(referralId);
    if(referral == null) {
        referral = new Referral(referralId);
        referral.save();
    }
}

export function getELPoint(): ELPoint {
    let id = Bytes.empty()
    let elPoint = ELPoint.load(id);
    if(elPoint == null) {
        elPoint = new ELPoint(id);
        elPoint.point = BigInt.fromU32(0);
        elPoint.lastUpdatedTimestamp = BigInt.fromU32(0);
    }
    return elPoint;
}

export const LAUNCH_TIMESTAMP = BigInt.fromU32(1712835084);
export const POINT_MULTIPLIER = BigInt.fromU32(10000);
