"use client";

import { useMemo, useState } from "react";
import { Room, buildExchangeNotes, formatRange, formatTime, getRooms, minutesUntil } from "@/lib/rooms";

const quickBookDurations = [15, 30, 45, 60];

export default function Home() {
  const rooms = useMemo(() => getRooms(), []);
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0]?.id ?? "");
  const [actionState, setActionState] = useState<string>("");
  const [duration, setDuration] = useState(30);

  const selectedRoom = rooms.find((room) => room.id === selectedRoomId) ?? rooms[0];
  const availableRooms = rooms.filter((room) => room.status === "available").length;
  const busyRooms = rooms.length - availableRooms;
  const utilization = Math.round(rooms.reduce((sum, room) => sum + room.utilization, 0) / rooms.length);
  const exchange = buildExchangeNotes();

  async function runAction(action: "book-now" | "extend" | "end-early" | "release-room") {
    if (!selectedRoom) return;

    setActionState("Working...");

    const response = await fetch(`/api/rooms/${selectedRoom.id}/actions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, durationMinutes: duration }),
    });

    const payload = (await response.json().catch(() => ({}))) as { message?: string; error?: string };
    setActionState(payload.message ?? payload.error ?? "Done.");
  }

  if (!selectedRoom) {
    return <main className="page-shell">No rooms configured.</main>;
  }

  return (
    <main className="page-shell room-shell">
      <div className="page-grid room-grid">
        <section className="hero room-hero card">
          <div>
            <span className="eyebrow">Room Hub</span>
            <h1>Meeting rooms with real Exchange-backed calendar presence.</h1>
            <p>
              A Robin-style room management app for workplace teams. Rooms pull their meeting data from Microsoft Exchange-backed calendars,
              show live status on screen, and let people book, extend, release, or end meetings without hunting through Outlook.
            </p>
          </div>

          <div className="metric-grid top-metrics">
            <Metric label="Rooms online" value={String(rooms.length)} note="Connected room surfaces" />
            <Metric label="Available now" value={String(availableRooms)} note="Fast-book candidates" />
            <Metric label="Busy now" value={String(busyRooms)} note="Live meetings on display" />
            <Metric label="Utilization" value={`${utilization}%`} note="Average room usage" />
          </div>
        </section>

        <section className="workspace-grid room-workspace">
          <aside className="column-side stack-gap rooms-column">
            <section className="card stack-gap">
              <div className="section-header compact">
                <div>
                  <span className="eyebrow">Portfolio</span>
                  <h2>Rooms</h2>
                </div>
                <span className="pill subtle">{rooms.length}</span>
              </div>

              <div className="room-list">
                {rooms.map((room) => {
                  const active = room.id === selectedRoom.id;
                  return (
                    <button key={room.id} type="button" className={`room-list-item ${active ? "room-list-item-active" : ""}`} onClick={() => setSelectedRoomId(room.id)}>
                      <div className="room-list-top">
                        <div>
                          <h3>{room.name}</h3>
                          <p>{room.location}</p>
                        </div>
                        <StatusBadge status={room.status} />
                      </div>
                      <div className="room-list-meta">
                        <span>{room.floor}</span>
                        <span>{room.capacity} seats</span>
                        <span>{room.exchangeConnected ? "Exchange live" : "Not connected"}</span>
                      </div>
                      <p className="room-list-brief">
                        {room.currentMeeting ? `${room.currentMeeting.title} · ${formatRange(room.currentMeeting.start, room.currentMeeting.end)}` : `Free until ${formatTime(room.freeUntil)}`}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="card stack-gap">
              <div className="section-header compact">
                <div>
                  <span className="eyebrow">Integration</span>
                  <h2>Microsoft data mode</h2>
                </div>
              </div>
              <div className="integration-box">
                <p><strong>Mode:</strong> {exchange.mode}</p>
                <p><strong>Tenant:</strong> {exchange.tenantConfigured ? "configured" : "missing"}</p>
                <p><strong>Client:</strong> {exchange.clientConfigured ? "configured" : "missing"}</p>
                <p><strong>Secret:</strong> {exchange.secretConfigured ? "configured" : "missing"}</p>
                <p className="integration-note">{exchange.note}</p>
              </div>
            </section>
          </aside>

          <div className="column-main stack-gap">
            <section className="card room-stage">
              <div className="room-stage-top">
                <div>
                  <span className="eyebrow">Now showing</span>
                  <h2>{selectedRoom.name}</h2>
                  <p className="room-stage-copy">
                    {selectedRoom.location} · {selectedRoom.floor} · {selectedRoom.capacity} people · {selectedRoom.email}
                  </p>
                </div>
                <StatusBadge status={selectedRoom.status} large />
              </div>

              <div className="room-presence-grid">
                <section className="presence-panel presence-main">
                  <span className="section-kicker">Live room state</span>
                  {selectedRoom.currentMeeting ? (
                    <>
                      <h3>{selectedRoom.currentMeeting.title}</h3>
                      <p className="presence-range">{formatRange(selectedRoom.currentMeeting.start, selectedRoom.currentMeeting.end)}</p>
                      <div className="presence-meta-row">
                        <span>Organizer: {selectedRoom.currentMeeting.organizer}</span>
                        <span>{selectedRoom.currentMeeting.attendees} attendees</span>
                        <span>{Math.max(0, minutesUntil(selectedRoom.currentMeeting.end))} min left</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3>Available right now</h3>
                      <p className="presence-range">Free until {formatTime(selectedRoom.freeUntil)}</p>
                      <div className="presence-meta-row">
                        <span>Walk-up booking ready</span>
                        <span>No live meeting</span>
                      </div>
                    </>
                  )}
                </section>

                <section className="presence-panel presence-side">
                  <span className="section-kicker">Quick controls</span>
                  <div className="duration-picker">
                    {quickBookDurations.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`duration-chip ${duration === option ? "duration-chip-active" : ""}`}
                        onClick={() => setDuration(option)}
                      >
                        {option}m
                      </button>
                    ))}
                  </div>

                  <div className="action-grid">
                    <button className="primary-button" type="button" onClick={() => runAction("book-now")}>Book now</button>
                    <button className="ghost-button" type="button" onClick={() => runAction("extend")}>Extend meeting</button>
                    <button className="ghost-button" type="button" onClick={() => runAction("end-early")}>End early</button>
                    <button className="ghost-button" type="button" onClick={() => runAction("release-room")}>Release room</button>
                  </div>

                  <p className="action-feedback">{actionState || "These controls hit API endpoints that can be wired to Exchange/Graph mutations."}</p>
                </section>
              </div>
            </section>

            <section className="card stack-gap">
              <div className="section-header compact">
                <div>
                  <span className="eyebrow">Timeline</span>
                  <h2>Upcoming meetings</h2>
                </div>
              </div>
              <div className="timeline-list">
                {selectedRoom.upcomingMeetings.length ? (
                  selectedRoom.upcomingMeetings.map((meeting) => (
                    <article key={meeting.id} className="timeline-item">
                      <div>
                        <p className="timeline-range">{formatRange(meeting.start, meeting.end)}</p>
                        <h3>{meeting.title}</h3>
                        <p className="timeline-meta">{meeting.organizer} · {meeting.attendees} attendees</p>
                      </div>
                      <span className="pill subtle">Starts in {Math.max(0, minutesUntil(meeting.start))}m</span>
                    </article>
                  ))
                ) : (
                  <div className="empty-state">Nothing else booked soon. The room gets a rare moment of peace.</div>
                )}
              </div>
            </section>

            <section className="card stack-gap">
              <div className="section-header compact">
                <div>
                  <span className="eyebrow">Why this app exists</span>
                  <h2>Product slice</h2>
                </div>
              </div>
              <div className="brief-grid value-grid">
                <ValueBlock
                  title="Direct room integration"
                  text="Room mailboxes are the source of truth. The display shows the actual meetings attached to the room, not a stale side database."
                />
                <ValueBlock
                  title="Display + control surface"
                  text="The same app supports hallway displays, admin overviews, and walk-up actions like book now, extend, release, or end early."
                />
                <ValueBlock
                  title="Robin-style experience"
                  text="Big room cards, clear occupancy, warm enterprise polish, and obvious actions. No clunky corporate grey maze."
                />
                <ValueBlock
                  title="Ready for Graph wiring"
                  text="The API surface is already shaped for real Microsoft integration. Swap demo data for Graph calls instead of rebuilding the app later."
                />
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>
  );
}

function StatusBadge({ status, large = false }: { status: Room["status"]; large?: boolean }) {
  return <span className={`status-badge status-${status} ${large ? "status-large" : ""}`}>{status.replace("-", " ")}</span>;
}

function ValueBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="brief-block value-block">
      <span>{title}</span>
      <p>{text}</p>
    </div>
  );
}
