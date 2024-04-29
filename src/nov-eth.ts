import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Transfer as TransferEvent } from "../generated/NovETH/NovETH";
import {
  LAUNCH_TIMESTAMP,
  POINT_MULTIPLIER,
  getTotalPoint,
  getUserPoint,
} from "./utils";

export function handleTrasfer(event: TransferEvent): void {
  let fromAddress = event.params.from;
  let toAddress = event.params.to;
  let value = event.params.value;
  let timestamp = event.block.timestamp;

  if (!fromAddress.equals(Address.zero())) {
    let fromUserPoint = getUserPoint(fromAddress);

    let point = getPoint(
      fromUserPoint.balance,
      fromUserPoint.lastUpdatedTimestamp,
      timestamp
    );
    fromUserPoint.point = fromUserPoint.point.plus(point);
    fromUserPoint.lastUpdatedTimestamp = timestamp;

    if (fromUserPoint.balance.ge(value)) {
      fromUserPoint.balance = fromUserPoint.balance.minus(value);
    } else {
      fromUserPoint.balance = BigInt.fromU32(0);
    }
    fromUserPoint.save();
  }

  if (!toAddress.equals(Address.zero())) {
    let toUserPoint = getUserPoint(toAddress);

    // when depositing
    if (fromAddress.equals(Address.zero())) {
      let earlyBonusPoint = getEarlyBonusPoint(value, timestamp);
      let whaleBonusPoint = getWhaleBonusPoint(value);
      toUserPoint.point = toUserPoint.point
        .plus(earlyBonusPoint)
        .plus(whaleBonusPoint);

      let totalPoint = getTotalPoint();
      let accPoint = getPoint(
        totalPoint.totalSupply,
        totalPoint.lastUpdatedTimestamp,
        timestamp
      );
      totalPoint.totalPoint = totalPoint.totalPoint
        .plus(accPoint)
        .plus(earlyBonusPoint)
        .plus(whaleBonusPoint);
      totalPoint.totalSupply = totalPoint.totalSupply.plus(value);
      totalPoint.lastUpdatedTimestamp = timestamp;
      totalPoint.save();
    }

    let point = getPoint(
      toUserPoint.balance,
      toUserPoint.lastUpdatedTimestamp,
      timestamp
    );

    toUserPoint.point = toUserPoint.point.plus(point);
    toUserPoint.lastUpdatedTimestamp = timestamp;

    toUserPoint.balance = toUserPoint.balance.plus(value);
    toUserPoint.save();
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
