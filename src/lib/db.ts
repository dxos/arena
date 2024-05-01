import { EchoReactiveObject } from "@dxos/echo-schema";
import { EchoDatabase } from "@dxos/react-client/echo";

export function removeMany(db: EchoDatabase, objects: EchoReactiveObject<any>[]) {
  objects.forEach((object) => {
    db.remove(object);
  });
}
