import { PageIntro } from "@/components/platform-sections";
import { formatRange } from "@/lib/platform";
import { getPlatformRooms } from "@/lib/server/platform-data";

export default async function StatusBoardsPage() {
  const rooms = await getPlatformRooms();

  return (
    <main className="page-shell platform-page status-board-page">
      <div className="page-grid">
        <PageIntro
          eyebrow="Status boards"
          title="Hallway display mode for live room presence and upcoming meetings."
          copy="Robin’s category includes tablets, signage, and visual room-state surfaces. This page starts the dedicated display mode for those flows."
        />

        <div className="status-board-grid">
          {rooms.map((room) => (
            <section key={room.id} className="card status-board-card">
              <div className="room-list-top">
                <div>
                  <span className="eyebrow">{room.location}</span>
                  <h2>{room.name}</h2>
                </div>
                <span className={`status-badge status-${room.status}`}>{room.status.replace("-", " ")}</span>
              </div>

              <div className="presence-panel presence-main">
                <span className="section-kicker">Now</span>
                <h3>{room.currentMeeting?.title ?? "Available now"}</h3>
                <p className="presence-range">
                  {room.currentMeeting ? formatRange(room.currentMeeting.start, room.currentMeeting.end) : `Free until ${new Date(room.freeUntil).toLocaleTimeString("en-DK", { hour: "2-digit", minute: "2-digit" })}`}
                </p>
              </div>

              <div className="timeline-list compact-timeline">
                {room.upcomingMeetings.slice(0, 2).map((meeting) => (
                  <article key={meeting.id} className="timeline-item">
                    <div>
                      <p className="timeline-range">{formatRange(meeting.start, meeting.end)}</p>
                      <h3>{meeting.title}</h3>
                      <p className="timeline-meta">{meeting.organizer}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
