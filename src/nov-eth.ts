import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Transfer as TransferEvent } from "../generated/NovETH/NovETH";
import { UserBalance, UserPoint } from "../generated/schema";
import { LAUNCH_TIMESTAMP, POINT_MULTIPLIER, getUserBalance, getUserPoint } from "./utils";

export function handleTrasfer(event: TransferEvent): void {
  let fromAddress = event.params.from;
  let toAddress = event.params.to;
  let value = event.params.value;
  let timestamp = event.block.timestamp;

  if (!fromAddress.equals(Address.zero())) {
    let fromUserBalance = getUserBalance(fromAddress);
    let fromUserPoint = getUserPoint(fromAddress);

    let point = getPoint(fromUserBalance, fromUserPoint, timestamp);
    fromUserPoint.point = fromUserPoint.point.plus(point);
    fromUserPoint.lastUpdatedTimestamp = timestamp;

    if (fromUserBalance.balance.ge(value)) {
      fromUserBalance.balance = fromUserBalance.balance.minus(value);
    } else {
      fromUserBalance.balance = new BigInt(0);
    }
    fromUserPoint.save();
    fromUserBalance.save();
  }

  if (!toAddress.equals(Address.zero())) {
    let toUserBalance = getUserBalance(toAddress);
    let toUserPoint = getUserPoint(toAddress);

    let point = getPoint(toUserBalance, toUserPoint, timestamp);
    toUserPoint.point = toUserPoint.point.plus(point);
    toUserPoint.lastUpdatedTimestamp = timestamp;

    toUserBalance.balance = toUserBalance.balance.plus(value);
    toUserPoint.save();
    toUserBalance.save();
  }
}

function getPoint(
  userBalance: UserBalance,
  userPoint: UserPoint,
  timestamp: BigInt
): BigInt {
  if (userPoint.lastUpdatedTimestamp.lt(LAUNCH_TIMESTAMP)) {
    return new BigInt(0);
  } else {
    let whaleMultiplier = getWhaleBonusMultiplier(userBalance);
    let periodInDays = timestamp
      .minus(userPoint.lastUpdatedTimestamp)
      .div(new BigInt(86400));
    let earlyBonusPoint = getEarlyBonusPoint(userBalance, userPoint, timestamp);
    let point = userBalance.balance
      .times(periodInDays)
      .times(POINT_MULTIPLIER)
      .plus(earlyBonusPoint)
      .times(whaleMultiplier)
      .div(new BigInt(1000));
    return point;
  }
}

/**
 launch--------lastUpdatedTimestamp-------current
    |<--delayInDays-->|<--- duringInDays --->|
    |<---         periodInDays           --->|
 */
function getEarlyBonusPoint(
  userBalance: UserBalance,
  userPoint: UserPoint,
  timestamp: BigInt
): BigInt {
  let delayInDays = userPoint.lastUpdatedTimestamp
    .minus(LAUNCH_TIMESTAMP)
    .div(new BigInt(86400));

  let periodInDays = timestamp.minus(LAUNCH_TIMESTAMP).div(new BigInt(86400));

  let duringInDays = periodInDays.minus(delayInDays);

  // multiplers: 4 3 2 1 0.5 because 1 is already added as base point
  let startMultiplier = new BigInt(4)
    .minus(delayInDays)
    .times(new BigInt(1000));

  if (startMultiplier.isZero()) startMultiplier = new BigInt(500);
  if (startMultiplier.lt(new BigInt(0))) startMultiplier = new BigInt(0);

  let bonusMultiplier = new BigInt(0);
  let duringInMultiplier = duringInDays.times(new BigInt(1000));

  if (startMultiplier.ge(duringInMultiplier)) {
    bonusMultiplier = startMultiplier
      .plus(startMultiplier.minus(duringInMultiplier).plus(new BigInt(1000)))
      .times(duringInDays)
      .div(new BigInt(2));
  } else {
    bonusMultiplier = startMultiplier
      .plus(new BigInt(1000))
      .times(startMultiplier)
      .div(new BigInt(2000))
      .plus(new BigInt(500));
  }

  return userBalance.balance
    .times(bonusMultiplier)
    .times(POINT_MULTIPLIER)
    .div(new BigInt(1000));
}

function getWhaleBonusMultiplier(userBalance: UserBalance): BigInt {
  let multiplier = new BigInt(1000);
  let balanceInEth = userBalance.balance.div(new BigInt(10**18));
  if (balanceInEth.ge(new BigInt(10))) {
    multiplier = new BigInt(1050);
  } else if (balanceInEth.ge(new BigInt(100))) {
    multiplier = new BigInt(1100);
  } else if (balanceInEth.ge(new BigInt(1000))) {
    multiplier = new BigInt(1150);
  } else if (balanceInEth.ge(new BigInt(2000))) {
    multiplier = new BigInt(1200);
  }
  return multiplier;
}
