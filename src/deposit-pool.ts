import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  ETHDeposit as ETHDepositEvent,
  AssetDeposit as AssetDepositEvent,
} from "../generated/DepositPool/DepositPool";
import {
  saveReferral,
  getUserPoint,
  getUserELPointPortion,
  getTotalELPointPortion,
} from "./utils";

export function handleETHDeposit(event: ETHDepositEvent): void {
  _saveRefferal(event.params.depositor, event.params.referralId);
  _saveUserELPortion(
    event.params.depositor,
    event.params.depositAmount,
    event.block.timestamp
  );
  _saveTotalELPortion(event.params.depositAmount, event.block.timestamp);
}
export function handleAssetDeposit(event: AssetDepositEvent): void {
  _saveRefferal(event.params.depositor, event.params.referralId);
  _saveUserELPortion(
    event.params.depositor,
    event.params.depositAmount,
    event.block.timestamp
  );
  _saveTotalELPortion(event.params.depositAmount, event.block.timestamp);
}

function _saveUserELPortion(
  depositor: Address,
  value: BigInt,
  timestamp: BigInt
): void {
  let userElPointPortion = getUserELPointPortion(depositor);
  if (!userElPointPortion.lastUpdatedTimestamp.isZero()) {
    userElPointPortion.elPointPortion = userElPointPortion.elPointPortion.plus(
      userElPointPortion.lstBalance.times(
        timestamp.minus(userElPointPortion.lastUpdatedTimestamp)
      )
    );
  }
  userElPointPortion.lstBalance = userElPointPortion.lstBalance.plus(value);
  userElPointPortion.lastUpdatedTimestamp = timestamp;
  userElPointPortion.save();
}

function _saveTotalELPortion(value: BigInt, timestamp: BigInt): void {
  let totalElPointPortion = getTotalELPointPortion();
  if (!totalElPointPortion.lastUpdatedTimestamp.isZero()) {
    totalElPointPortion.totalElPointPortion =
      totalElPointPortion.totalElPointPortion.plus(
        totalElPointPortion.totalLstBalance.times(
          timestamp.minus(totalElPointPortion.lastUpdatedTimestamp)
        )
      );
  }
  totalElPointPortion.totalLstBalance =
    totalElPointPortion.totalLstBalance.plus(value);
  totalElPointPortion.lastUpdatedTimestamp = timestamp;
  totalElPointPortion.save();
}

function _saveRefferal(depositor: Address, referralId: string): void {
  if (!referralId) return;

  let depositorUserPoint = getUserPoint(depositor);

  saveReferral(referralId);

  // set referer for the first time
  if (!depositorUserPoint.referral) {
    depositorUserPoint.referral = referralId;
  }

  depositorUserPoint.save();
}
