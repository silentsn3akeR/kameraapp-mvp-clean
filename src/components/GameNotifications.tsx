import { GameNotification } from "../core/types";

export default function GameNotifications({
  notifications,
  onRemove,
}: {
  notifications: GameNotification[];
  onRemove: (id: string) => void;
}) {
  return (
    <div style={{ position: "fixed", top: 10, right: 10 }}>
      {notifications.map((n) => (
        <div
          key={n.id}
          style={{
            background: "#111",
            padding: 10,
            marginBottom: 8,
            borderRadius: 8,
          }}
        >
          <strong>{n.title}</strong>
          <p>{n.message}</p>
          <button onClick={() => onRemove(n.id)}>x</button>
        </div>
      ))}
    </div>
  );
}
