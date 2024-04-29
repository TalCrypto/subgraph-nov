import { BigInt } from "@graphprotocol/graph-ts";
import {
  ETHStaked as ETHStakedEvent,
  AssetDepositIntoStrategy as AssetDepositedEvent,
} from "../generated/ETHNodeDelegator/NodeDelegator";
import { getTotalELPoint } from "./utils";

export function handleETHStatked(event: ETHStakedEvent): void {
  _saveTotalElPoint(event.params.amount, event.block.timestamp);
}

export function handleAssetStatked(event: AssetDepositedEvent): void {
  _saveTotalElPoint(event.params.depositAmount, event.block.timestamp);
}

function _saveTotalElPoint(amount: BigInt, timestamp: BigInt): void {
  let totalElPoint = getTotalELPoint();
  if (!totalElPoint.lastUpdatedTimestamp.isZero()) {
    let periodInHours = timestamp
      .minus(totalElPoint.lastUpdatedTimestamp)
      .div(BigInt.fromU32(3600));
    totalElPoint.totalElPoint = totalElPoint.totalElPoint.plus(
      periodInHours.times(totalElPoint.totalElBalance)
    );
  }
  totalElPoint.totalElBalance = totalElPoint.totalElBalance.plus(amount);
  totalElPoint.lastUpdatedTimestamp = timestamp;
  totalElPoint.save();
}
