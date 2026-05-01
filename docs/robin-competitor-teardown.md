# Robin-Class Competitor Teardown

This is a research note for shaping Room Hub into a serious workplace-management competitor.

## Publicly visible category areas

Based on Robin public pages and product messaging, the category footprint includes:

1. **Rooms / meeting management**
   - room scheduling
   - room availability
   - conflict resolution
   - in-room controls / display surfaces

2. **Desk booking**
   - hot desks
   - neighborhoods
   - assigned seating
   - mobile booking

3. **Unified resource booking**
   - desks
   - rooms
   - parking
   - lockers / custom resources

4. **Visitor management**
   - invite visitors
   - check-in workflows
   - host notifications
   - arrival instructions

5. **Status boards / signage / wayfinding**
   - hallway displays
   - room tablets
   - navigation around office locations

6. **Analytics / planning**
   - utilization
   - occupancy
   - reporting
   - forecasting
   - office planning insights

7. **Automation / AI layer**
   - booking recommendations
   - automation based on attendance patterns
   - AI-assisted reporting and planning

8. **Integrations**
   - Microsoft
   - Google
   - Slack
   - access control / occupancy signals

## Product implications for Room Hub

To be a credible competitor, Room Hub needs:

- multi-tenant org/workspace structure
- real persisted booking data
- role-aware admin settings
- unified resource types, not just rooms/desks
- status-board / tablet mode
- real sync with Microsoft room mailboxes
- eventually mobile-first workflows

## Implementation phases

### Phase 1 — Foundation
- Prisma schema
- platform shell
- rooms / meetings / desks / visitors / analytics routes
- bootstrap data

### Phase 2 — Real data plumbing
- switch pages to server queries
- unify API routes around persisted data
- add create/update flows

### Phase 3 — Broaden category coverage
- resources surface
- parking + custom resources
- status boards / room display mode
- settings / policies

### Phase 4 — Integrations
- Microsoft Graph
- Google Calendar
- Slack
- occupancy sources

### Phase 5 — Competitive depth
- no-show automation
- recommendations
- neighborhood rules
- search / wayfinding / people presence
- mobile-oriented experiences

## Current status

Room Hub now has:
- multi-page platform shell
- database schema
- persisted demo workspace path
- routes for rooms, meetings, desks, visitors, analytics
- resources, status boards, settings surfaces started

Still missing:
- end-to-end write flows
- auth / org scoping
- real Microsoft sync
- robust admin UX
- floor maps
- presence signals
- production-grade onboarding
