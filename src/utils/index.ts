import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { TotalELPoint, Referral, TotalPoint, UserPoint } from "../../generated/schema";

export function getUserPoint(user: Address): UserPoint {
  let userPoint = UserPoint.load(user);
  if (userPoint == null) {
    userPoint = new UserPoint(user);
    userPoint.balance = BigInt.fromU32(0);
    userPoint.lstBalance = BigInt.fromU32(0);
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

export function getTotalELPoint(): TotalELPoint {
    let id = Bytes.empty()
    let elPoint = TotalELPoint.load(id);
    if(elPoint == null) {
        elPoint = new TotalELPoint(id);
        elPoint.totalLstBalance = BigInt.fromU32(0);
        elPoint.totalElBalance = BigInt.fromU32(0);
        elPoint.totalElPoint = BigInt.fromU32(0);
        elPoint.lastUpdatedTimestamp = BigInt.fromU32(0);
    }
    return elPoint;
}

export function getTotalPoint(): TotalPoint {
    let id = Bytes.empty()
    let totalPoint = TotalPoint.load(id);
    if(totalPoint == null) {
        totalPoint = new TotalPoint(id);
        totalPoint.totalSupply = BigInt.fromU32(0);
        totalPoint.totalPoint = BigInt.fromU32(0);
        totalPoint.lastUpdatedTimestamp = BigInt.fromU32(0);
    }
    return totalPoint;
}

export const LAUNCH_TIMESTAMP = BigInt.fromU32(1712835084);
export const POINT_MULTIPLIER = BigInt.fromU32(10000);
