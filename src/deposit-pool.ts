import { Address } from "@graphprotocol/graph-ts";
import {
  ETHDeposit as ETHDepositEvent,
  AssetDeposit as AssetDepositEvent,
} from "../generated/LRTDepositPool/DepositPool";
import { base62ToHex } from "./utils/base62";
import { getReferral, getUserPoint } from "./utils";

export function handleETHDeposit(event: ETHDepositEvent): void {
    _saveRefferal(event.params.depositor, event.params.referralId)
}
export function handleAssetDeposit(event: AssetDepositEvent): void {
    _saveRefferal(event.params.depositor, event.params.referralId)
}

function _saveRefferal(depositor: Address, referralId: string): void {
    let depositorUserPoint = getUserPoint(depositor);
    let refererAddress = base62ToHex(referralId);
    let referral = getReferral(refererAddress);

    // set referer for the first time
    if(depositorUserPoint.referer == null) {
        depositorUserPoint.referer = refererAddress;
    }

    referral.save();
    depositorUserPoint.save();
}
