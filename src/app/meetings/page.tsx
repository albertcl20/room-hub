import { PageIntro, SectionCard } from "@/components/platform-sections";
import { formatRange, getMeetings, getRooms, minutesUntil } from "@/lib/platform";

export default function MeetingsPage() {
  const meetings = getMeetings();
  const roomIndex = Object.fromEntries(getRooms().map((room) => [room.id, room.name]));

  return (
    <main className="page-shell platform-page">
      <div className="page-grid">
        <PageIntro
          eyebrow="Meetings"
          title="Run the day’s meeting schedule without Outlook tab-spelunking."
          copy="See the cross-room meeting timeline, organizer context, room assignment, and fast operational actions."
        />

        <SectionCard eyebrow="Schedule" title="Today’s room-based meeting queue" aside={<button className="primary-button">Create meeting</button>}>
          <div className="timeline-list">
            {meetings.map((meeting) => (
              <article key={meeting.id} className="timeline-item timeline-item-rich">
                <div>
                  <p className="timeline-range">{formatRange(meeting.start, meeting.end)}</p>
                  <h3>{meeting.title}</h3>
                  <p className="timeline-meta">{meeting.organizer} · {meeting.attendees} attendees · {meeting.roomId ? roomIndex[meeting.roomId] : "Unassigned"}</p>
                </div>
                <div className="timeline-actions">
                  <span className="pill subtle">{meeting.status}</span>
                  <span className="pill subtle">{meeting.status === "live" ? `${Math.max(0, minutesUntil(meeting.end))}m left` : `Starts in ${Math.max(0, minutesUntil(meeting.start))}m`}</span>
                  <button className="ghost-button">Extend</button>
                  <button className="ghost-button">Move room</button>
                </div>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>
    </main>
  );
}
