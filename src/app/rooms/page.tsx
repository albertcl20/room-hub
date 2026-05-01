"use client";

import { useState } from "react";
import { PageIntro, SectionCard } from "@/components/platform-sections";
import { formatRange, formatTime, getRooms, minutesUntil } from "@/lib/platform";

export default function RoomsPage() {
  const rooms = getRooms();
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0]?.id ?? "");
  const selectedRoom = rooms.find((room) => room.id === selectedRoomId) ?? rooms[0];

  return (
    <main className="page-shell platform-page">
      <div className="page-grid">
        <PageIntro
          eyebrow="Rooms"
          title="Manage every meeting room like a live operational asset."
          copy="View live occupancy, upcoming bookings, amenities, and quick actions for every connected room."
        />

        <div className="platform-content-grid wide-main-grid">
          <SectionCard eyebrow="Room inventory" title="Connected spaces">
            <div className="room-list">
              {rooms.map((room) => (
                <button key={room.id} type="button" className={`room-list-item ${selectedRoom.id === room.id ? "room-list-item-active" : ""}`} onClick={() => setSelectedRoomId(room.id)}>
                  <div className="room-list-top">
                    <div>
                      <h3>{room.name}</h3>
                      <p>{room.location}</p>
                    </div>
                    <span className={`status-badge status-${room.status}`}>{room.status.replace("-", " ")}</span>
                  </div>
                  <div className="room-list-meta">
                    <span>{room.floor}</span>
                    <span>{room.capacity} seats</span>
                    <span>{room.exchangeConnected ? "Exchange live" : "Pending"}</span>
                  </div>
                  <p className="room-list-brief">{room.currentMeeting ? room.currentMeeting.title : `Free until ${formatTime(room.freeUntil)}`}</p>
                </button>
              ))}
            </div>
          </SectionCard>

          <SectionCard eyebrow="Room detail" title={selectedRoom.name}>
            <div className="stack-gap">
              <div className="presence-panel presence-main">
                <span className="section-kicker">Current state</span>
                <h3>{selectedRoom.currentMeeting ? selectedRoom.currentMeeting.title : "Available now"}</h3>
                <p className="presence-range">
                  {selectedRoom.currentMeeting ? formatRange(selectedRoom.currentMeeting.start, selectedRoom.currentMeeting.end) : `Free until ${formatTime(selectedRoom.freeUntil)}`}
                </p>
                <div className="presence-meta-row">
                  <span>{selectedRoom.location}</span>
                  <span>{selectedRoom.floor}</span>
                  <span>{selectedRoom.capacity} people</span>
                  {selectedRoom.currentMeeting ? <span>{Math.max(0, minutesUntil(selectedRoom.currentMeeting.end))} min left</span> : null}
                </div>
              </div>

              <div className="brief-grid value-grid">
                <div className="brief-block value-block"><span>Amenities</span><p>{selectedRoom.amenities.join(" · ")}</p></div>
                <div className="brief-block value-block"><span>Mailbox</span><p>{selectedRoom.email}</p></div>
              </div>

              <div className="timeline-list">
                {selectedRoom.upcomingMeetings.map((meeting) => (
                  <article key={meeting.id} className="timeline-item">
                    <div>
                      <p className="timeline-range">{formatRange(meeting.start, meeting.end)}</p>
                      <h3>{meeting.title}</h3>
                      <p className="timeline-meta">{meeting.organizer} · {meeting.attendees} attendees</p>
                    </div>
                    <span className="pill subtle">Starts in {Math.max(0, minutesUntil(meeting.start))}m</span>
                  </article>
                ))}
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </main>
  );
}
