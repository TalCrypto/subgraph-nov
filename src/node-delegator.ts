import { BigInt } from "@graphprotocol/graph-ts";
import { ETHStaked as ETHStakedEvent } from "../generated/ETHNodeDelegator/NodeDelegator";
import { getELPoint } from "./utils";

export function handleETHStatked(event: ETHStakedEvent): void {
    let elPoint = getELPoint();
    elPoint.lastUpdatedTimestamp = event.block.timestamp;
    if(!elPoint.lastUpdatedTimestamp.isZero()) {
        let periodInHours = event.block.timestamp.minus(elPoint.lastUpdatedTimestamp).div(new BigInt(3600));
        elPoint.point = elPoint.point.plus(periodInHours.times(event.params.amount));
    }
    elPoint.save();
}
