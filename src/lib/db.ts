import { EchoDatabase, TypedObject } from "@dxos/echo-schema";

export function removeMany(db: EchoDatabase, objects: TypedObject[]) {
  objects.forEach((object) => {
    db.remove(object);
  });
}
