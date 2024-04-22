// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal,
} from "@graphprotocol/graph-ts";

export class UserBalance extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save UserBalance entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type UserBalance must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`,
      );
      store.set("UserBalance", id.toBytes().toHexString(), this);
    }
  }

  static loadInBlock(id: Bytes): UserBalance | null {
    return changetype<UserBalance | null>(
      store.get_in_block("UserBalance", id.toHexString()),
    );
  }

  static load(id: Bytes): UserBalance | null {
    return changetype<UserBalance | null>(
      store.get("UserBalance", id.toHexString()),
    );
  }

  get id(): Bytes {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set id(value: Bytes) {
    this.set("id", Value.fromBytes(value));
  }

  get balance(): BigInt {
    let value = this.get("balance");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set balance(value: BigInt) {
    this.set("balance", Value.fromBigInt(value));
  }
}

export class UserPoint extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save UserPoint entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type UserPoint must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`,
      );
      store.set("UserPoint", id.toBytes().toHexString(), this);
    }
  }

  static loadInBlock(id: Bytes): UserPoint | null {
    return changetype<UserPoint | null>(
      store.get_in_block("UserPoint", id.toHexString()),
    );
  }

  static load(id: Bytes): UserPoint | null {
    return changetype<UserPoint | null>(
      store.get("UserPoint", id.toHexString()),
    );
  }

  get id(): Bytes {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set id(value: Bytes) {
    this.set("id", Value.fromBytes(value));
  }

  get point(): BigInt {
    let value = this.get("point");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set point(value: BigInt) {
    this.set("point", Value.fromBigInt(value));
  }

  get lastUpdatedTimestamp(): BigInt {
    let value = this.get("lastUpdatedTimestamp");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set lastUpdatedTimestamp(value: BigInt) {
    this.set("lastUpdatedTimestamp", Value.fromBigInt(value));
  }

  get referer(): Bytes | null {
    let value = this.get("referer");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set referer(value: Bytes | null) {
    if (!value) {
      this.unset("referer");
    } else {
      this.set("referer", Value.fromBytes(<Bytes>value));
    }
  }
}

export class Referral extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Referral entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type Referral must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`,
      );
      store.set("Referral", id.toBytes().toHexString(), this);
    }
  }

  static loadInBlock(id: Bytes): Referral | null {
    return changetype<Referral | null>(
      store.get_in_block("Referral", id.toHexString()),
    );
  }

  static load(id: Bytes): Referral | null {
    return changetype<Referral | null>(store.get("Referral", id.toHexString()));
  }

  get id(): Bytes {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set id(value: Bytes) {
    this.set("id", Value.fromBytes(value));
  }

  get referees(): UserPointLoader {
    return new UserPointLoader(
      "Referral",
      this.get("id")!.toBytes().toHexString(),
      "referees",
    );
  }
}

export class UserPointLoader extends Entity {
  _entity: string;
  _field: string;
  _id: string;

  constructor(entity: string, id: string, field: string) {
    super();
    this._entity = entity;
    this._id = id;
    this._field = field;
  }

  load(): UserPoint[] {
    let value = store.loadRelated(this._entity, this._id, this._field);
    return changetype<UserPoint[]>(value);
  }
}