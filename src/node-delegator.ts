import { BigInt } from "@graphprotocol/graph-ts";
import { ETHStaked as ETHStakedEvent } from "../generated/ETHNodeDelegator/NodeDelegator";
import { getTotalELPoint } from "./utils";

export function handleETHStatked(event: ETHStakedEvent): void {
    let totalElPoint = getTotalELPoint();
    if(!totalElPoint.lastUpdatedTimestamp.isZero()) {
        let periodInHours = event.block.timestamp.minus(totalElPoint.lastUpdatedTimestamp).div(BigInt.fromU32(3600));
        totalElPoint.totalElPoint = totalElPoint.totalElPoint.plus(periodInHours.times(event.params.amount));
    }
    totalElPoint.lastUpdatedTimestamp = event.block.timestamp;
    totalElPoint.save();
}
