import { Address, ByteArray } from "@graphprotocol/graph-ts";
import {
  ETHDeposit as ETHDepositEvent,
  AssetDeposit as AssetDepositEvent,
} from "../generated/DepositPool/DepositPool";
import { saveReferral, getUserPoint } from "./utils";

export function handleETHDeposit(event: ETHDepositEvent): void {
    _saveRefferal(event.params.depositor, event.params.referralId)
}
export function handleAssetDeposit(event: AssetDepositEvent): void {
    _saveRefferal(event.params.depositor, event.params.referralId)
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
