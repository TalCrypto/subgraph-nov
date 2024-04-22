import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Transfer as TransferEvent } from "../generated/NovETH/NovETH";
import { UserBalance, UserPoint } from "../generated/schema";
import {
  LAUNCH_TIMESTAMP,
  POINT_MULTIPLIER,
  getUserBalance,
  getUserPoint,
} from "./utils";

export function handleTrasfer(event: TransferEvent): void {
  let fromAddress = event.params.from;
  let toAddress = event.params.to;
  let value = event.params.value;
  let timestamp = event.block.timestamp;

  if (!fromAddress.equals(Address.zero())) {
    let fromUserBalance = getUserBalance(fromAddress);
    let fromUserPoint = getUserPoint(fromAddress);

    let point = getPoint(
      fromUserBalance.balance,
      fromUserPoint.lastUpdatedTimestamp,
      timestamp
    );
    fromUserPoint.point = fromUserPoint.point.plus(point);
    fromUserPoint.lastUpdatedTimestamp = timestamp;

    if (fromUserBalance.balance.ge(value)) {
      fromUserBalance.balance = fromUserBalance.balance.minus(value);
    } else {
      fromUserBalance.balance = BigInt.fromU32(0);
    }
    fromUserPoint.save();
    fromUserBalance.save();
  }

  if (!toAddress.equals(Address.zero())) {
    let toUserBalance = getUserBalance(toAddress);
    let toUserPoint = getUserPoint(toAddress);

    // when depositing
    if (fromAddress.equals(Address.zero())) {
      let earlyBonusPoint = getEarlyBonusPoint(value, timestamp);
      let whaleBonusPoint = getWhaleBonusPoint(value);
      toUserPoint.point = toUserPoint.point
        .plus(earlyBonusPoint)
        .plus(whaleBonusPoint);
    }

    let point = getPoint(
      toUserBalance.balance,
      toUserPoint.lastUpdatedTimestamp,
      timestamp
    );

    toUserPoint.point = toUserPoint.point.plus(point);
    toUserPoint.lastUpdatedTimestamp = timestamp;

    toUserBalance.balance = toUserBalance.balance.plus(value);
    toUserPoint.save();
    toUserBalance.save();
  }
}

function getPoint(
  beforeBalance: BigInt,
  lastUpdatedTimestamp: BigInt,
  timestamp: BigInt
): BigInt {
  if (lastUpdatedTimestamp.isZero()) return BigInt.fromU32(0);
  let periodInSec = timestamp.minus(lastUpdatedTimestamp);
  return beforeBalance
    .times(periodInSec)
    .times(POINT_MULTIPLIER)
    .div(BigInt.fromU32(86400));
}

function getEarlyBonusPoint(value: BigInt, timestamp: BigInt): BigInt {
  // if deposit earlier than the launch time, return 0
  if (timestamp.lt(LAUNCH_TIMESTAMP)) return BigInt.fromU32(0);
  let delayInDays = timestamp
    .minus(LAUNCH_TIMESTAMP)
    .div(BigInt.fromU32(86400));

  // multiplers: 4 3 2 1 0.5 because 1 was already added as base point
  let multiplier = BigInt.fromU32(4)
    .minus(delayInDays)
    .times(BigInt.fromU32(100));

  if (multiplier.isZero()) multiplier = BigInt.fromU32(50);
  if (multiplier.lt(BigInt.fromU32(0))) multiplier = BigInt.fromU32(0);

  return value
    .times(multiplier)
    .times(POINT_MULTIPLIER)
    .div(BigInt.fromU32(100));
}

function getWhaleBonusPoint(value: BigInt): BigInt {
  let multiplier = BigInt.fromU32(0);
  let balanceInEth = value.div(BigInt.fromU32(10 ** 18));
  if (balanceInEth.ge(BigInt.fromU32(10))) {
    multiplier = BigInt.fromU32(5);
  } else if (balanceInEth.ge(BigInt.fromU32(100))) {
    multiplier = BigInt.fromU32(10);
  } else if (balanceInEth.ge(BigInt.fromU32(1000))) {
    multiplier = BigInt.fromU32(15);
  } else if (balanceInEth.ge(BigInt.fromU32(2000))) {
    multiplier = BigInt.fromU32(20);
  }
  return value
    .times(multiplier)
    .times(POINT_MULTIPLIER)
    .div(BigInt.fromU32(100));
}
