import { useForm } from "react-hook-form";
import { useActiveRoom } from "../hooks/useActiveRoom";
import { Panel } from "$ui/Panel";
import { Button } from "@dxos/react-ui";
import { Input } from "@dxos/react-ui";
import { useIntentDispatcher } from "@dxos/app-framework";
import { RoomManagerIntent, roomManagerIntent } from "../room-manager-plugin";

type FormValues = { roomName: string };

export const RoomManager = () => {
  const room = useActiveRoom();
  const dispatch = useIntentDispatcher();

  const { handleSubmit, watch, setValue } = useForm({
    defaultValues: { roomName: room?.properties?.name || "" },
  });

  const onSubmit = ({ roomName }: FormValues) => {
    if (roomName.length > 0 && roomName.length <= 32) {
      if (room) {
        dispatch(
          roomManagerIntent(RoomManagerIntent.UPDATE_ROOM_NAME, {
            key: room.key.toHex(),
            name: roomName,
          }),
        );
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="max-w-lg p-1 mx-auto mt-4 sm:mt-12">
        <Panel rimLight className="p-4 flex flex-col gap-3">
          <h2 className="text-3xl font-bold" style={{ fontFamily: "EB Garamond" }}>
            Manage Room
          </h2>
          <Input.Root>
            <Input.Label>Room name</Input.Label>
            <Input.TextInput
              crossOrigin={false}
              autoFocus
              classNames="font-mono"
              placeholder={room?.properties?.name || "Room name"}
              value={watch("roomName")}
              onChange={({ target: { value } }) => setValue("roomName", value)}
            />
          </Input.Root>
          <div className="w-full flex flex-row-reverse">
            <Button type="submit" aria-label="Create game" variant="primary">
              Update
            </Button>
          </div>
        </Panel>
      </div>
    </form>
  );
};
