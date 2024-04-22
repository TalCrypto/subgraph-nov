import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  ETHDeposit as ETHDepositEvent,
  AssetDeposit as AssetDepositEvent,
} from "../generated/DepositPool/DepositPool";
import { saveReferral, getUserPoint, getTotalELPoint } from "./utils";

export function handleETHDeposit(event: ETHDepositEvent): void {
    _saveRefferal(event.params.depositor, event.params.referralId);
    _saveLstBalance(event.params.depositor, event.params.depositAmount);
}
export function handleAssetDeposit(event: AssetDepositEvent): void {
    _saveRefferal(event.params.depositor, event.params.referralId);
    _saveLstBalance(event.params.depositor, event.params.depositAmount);
}

function _saveLstBalance(depositor: Address, value: BigInt): void {
    let userPoint = getUserPoint(depositor);
    let totalELPoint = getTotalELPoint();
    userPoint.lstBalance = userPoint.lstBalance.plus(value);
    totalELPoint.totalLstBalance = totalELPoint.totalLstBalance.plus(value);
    userPoint.save();
    totalELPoint.save();
}

function _saveRefferal(depositor: Address, referralId: string): void {
    
    if(!referralId) return;

    let depositorUserPoint = getUserPoint(depositor);

    saveReferral(referralId);

    // set referer for the first time
    if(!depositorUserPoint.referral) {
        depositorUserPoint.referral = referralId;
    }

    depositorUserPoint.save();
}
