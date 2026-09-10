import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

const PLAYERS = [
  { number: 1, name: "T. Mensah", position: "GK", status: "FIRST_TEAM", bio: "Commands the box like it is his living room." },
  { number: 2, name: "K. Coker", position: "FB", status: "FIRST_TEAM", bio: "Right-back who never stops running." },
  { number: 3, name: "S. Nwosu", position: "FB", status: "FIRST_TEAM", bio: "Left-back with a proper delivery." },
  { number: 4, name: "D. Osei", position: "CB", status: "FIRST_TEAM", bio: "Centre-half, captain, eleven seasons." },
  { number: 5, name: "R. Bello", position: "CB", status: "FIRST_TEAM", bio: "Composed on the ball, reads the game early." },
  { number: 6, name: "M. Yusuf", position: "DM", status: "FIRST_TEAM", bio: "Sits deep, breaks play up, gives it simple." },
  { number: 7, name: "F. Diallo", position: "W", status: "FIRST_TEAM", bio: "Quick feet, likes to come inside and shoot." },
  { number: 8, name: "A. Balogun", position: "CM", status: "FIRST_TEAM", bio: "Box-to-box engine." },
  { number: 9, name: "J. Adeyemi", position: "ST", status: "FIRST_TEAM", bio: "Top scorer two seasons running." },
  { number: 10, name: "E. Chukwu", position: "AM", status: "FIRST_TEAM", bio: "Plays between the lines." },
  { number: 11, name: "O. Bassey", position: "W", status: "FIRST_TEAM", bio: "Academy graduate, first-team regular." },
  { number: 12, name: "D. Farrell", position: "GK", status: "RESERVE", bio: "Understudy keeper, commanding on crosses." },
  { number: 14, name: "B. Musa", position: "CB", status: "RESERVE", bio: "Versatile cover across the back line." },
  { number: 16, name: "T. Eze", position: "DM", status: "RESERVE", bio: "Tenacious in the tackle, still learning the final ball." },
  { number: 17, name: "L. Achara", position: "CM", status: "RESERVE", bio: "Energetic squad option, good engine." },
  { number: 19, name: "C. Ibe", position: "ST", status: "RESERVE", bio: "Raw pace, still finding his final-third touch." },
] as const;

const FIXTURES = [
  { opponent: "Denholm Wanderers", competition: "League", round: null, kickoff: "2026-08-17T15:00:00", venue: "AWAY", status: "PLAYED", ourScore: 3, theirScore: 0, scorers: "Adeyemi 12', 54', Chukwu 78'" },
  { opponent: "Eastfield United", competition: "County Cup", round: "First round", kickoff: "2026-08-20T19:45:00", venue: "HOME", status: "PLAYED", ourScore: 0, theirScore: 2, scorers: null },
  { opponent: "Kingsbury Rovers", competition: "League", round: null, kickoff: "2026-08-24T15:00:00", venue: "AWAY", status: "PLAYED", ourScore: 1, theirScore: 1, scorers: "Balogun 84'" },
  { opponent: "Marlow Town", competition: "League", round: null, kickoff: "2026-08-31T15:00:00", venue: "HOME", status: "PLAYED", ourScore: 2, theirScore: 1, scorers: "Adeyemi 23', 71'" },
  { opponent: "Thornbridge Athletic", competition: "League Cup", round: "Second round", kickoff: "2026-09-14T15:00:00", venue: "HOME", status: "SCHEDULED", ourScore: null, theirScore: null, scorers: null },
  { opponent: "Ashby Celtic", competition: "League", round: null, kickoff: "2026-09-21T15:00:00", venue: "AWAY", status: "SCHEDULED", ourScore: null, theirScore: null, scorers: null },
  { opponent: "Whitmore Park", competition: "League", round: null, kickoff: "2026-09-24T19:45:00", venue: "HOME", status: "SCHEDULED", ourScore: null, theirScore: null, scorers: null },
  { opponent: "Stanhope Borough", competition: "League", round: null, kickoff: "2026-09-28T15:00:00", venue: "AWAY", status: "SCHEDULED", ourScore: null, theirScore: null, scorers: null },
] as const;

// [label, position, x, y] — mirrors the 4-3-3 shape in components/matchday/formations.ts
const FORMATION_433 = [
  ["GK", "GK", 50, 6],
  ["LB", "FB", 15, 28],
  ["CB", "CB", 38, 23],
  ["CB", "CB", 62, 23],
  ["RB", "FB", 85, 28],
  ["CDM", "DM", 50, 45],
  ["CM", "CM", 26, 55],
  ["CM", "CM", 74, 55],
  ["LW", "W", 18, 78],
  ["ST", "ST", 50, 85],
  ["RW", "W", 82, 78],
] as const;

const TRAININGS = [
  { title: "Recovery session", location: "Pearson Park", startsAt: "2026-08-30T10:00:00", recurrence: "ONE_OFF" as const, notes: null, presentNumbers: [1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 14, 17], absentNumbers: [5, 16] },
  { title: "Tuesday training", location: "Pearson Park", startsAt: "2026-09-01T19:30:00", recurrence: "WEEKLY" as const, notes: null, presentNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 16, 17, 19], absentNumbers: [12] },
  { title: "Small-sided games", location: "Hartwell Sports Hall", startsAt: "2026-09-04T19:30:00", recurrence: "ONE_OFF" as const, notes: null, presentNumbers: [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12], absentNumbers: [4, 14, 16, 17, 19] },
  { title: "Tuesday training", location: "Pearson Park", startsAt: "2026-09-08T19:30:00", recurrence: "WEEKLY" as const, notes: "Shooting drills, set pieces for Thornbridge.", presentNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 17], absentNumbers: [19] },
  { title: "Set pieces for Saturday", location: "Pearson Park", startsAt: "2026-09-17T19:30:00", recurrence: "ONE_OFF" as const, notes: "Corners and free-kick routines ahead of Thornbridge.", presentNumbers: [], absentNumbers: [] },
  { title: "Tuesday training", location: "Pearson Park", startsAt: "2026-09-22T19:30:00", recurrence: "WEEKLY" as const, notes: null, presentNumbers: [], absentNumbers: [] },
];

const NEWS = [
  {
    slug: "victory-at-denholm",
    title: "Three goals, three points at Denholm",
    kind: "MATCH_REPORT" as const,
    excerpt: "Adeyemi's double either side of a Chukwu strike sends OHC FC top on the opening weekend.",
    byline: "By Ade Okafor, club media",
    publishedAt: "2026-08-17T18:00:00",
    competition: "FULL TIME · LEAGUE",
    ourScore: 3,
    theirScore: 0,
    startingXi: "Mensah; Coker, Osei, Bello, Nwosu; Yusuf, Balogun, Chukwu; Diallo, Adeyemi, Bassey.",
    subs: "Subs: Farrell, Musa, Eze, Achara, Ibe.",
    body: "Denholm Wanderers 0, OHC FC 3. A near-perfect opening day on the road, with Adeyemi opening the scoring inside twelve minutes after a sharp Diallo cutback.\n\nChukwu doubled the lead just after the hour with a curling effort from the edge of the box, and Adeyemi wrapped things up late on with his second of the afternoon.\n\nA statement start to the league campaign, and a sign of the squad depth on the bench too.",
  },
  {
    slug: "cup-exit-at-the-first-hurdle",
    title: "Cup exit at the first hurdle",
    kind: "MATCH_REPORT" as const,
    excerpt: "Eastfield United take the County Cup tie 2–0 on a night when nothing quite dropped for us.",
    byline: "By Ade Okafor, club media",
    publishedAt: "2026-08-20T21:30:00",
    competition: "FULL TIME · COUNTY CUP",
    ourScore: 0,
    theirScore: 2,
    startingXi: "Mensah; Coker, Osei, Bello, Nwosu; Yusuf, Balogun, Chukwu; Diallo, Adeyemi, Bassey.",
    subs: "Subs: Farrell, Musa, Eze, Achara, Ibe.",
    body: "OHC FC 0, Eastfield United 2. A disappointing night at Pearson Park as an early cup exit ends the County Cup campaign before it really started.\n\nEastfield were clinical either side of half-time, and despite territory late on, the finishing touch was missing all evening.\n\nAttention now turns fully to the league.",
  },
  {
    slug: "point-on-the-road-at-kingsbury",
    title: "Point on the road at Kingsbury",
    kind: "MATCH_REPORT" as const,
    excerpt: "A late Balogun equaliser earns a hard-fought draw on a heavy pitch. Not pretty, but it counts.",
    byline: "By Ade Okafor, club media",
    publishedAt: "2026-08-24T18:00:00",
    competition: "FULL TIME · LEAGUE",
    ourScore: 1,
    theirScore: 1,
    startingXi: "Mensah; Coker, Osei, Bello, Nwosu; Yusuf, Balogun, Chukwu; Diallo, Adeyemi, Bassey.",
    subs: "Subs: Farrell, Musa, Eze, Achara, Ibe.",
    body: "Kingsbury Rovers 1, OHC FC 1. A scrappy affair on a heavy pitch, with the hosts taking a first-half lead against the run of play.\n\nOHC FC pushed hard for an equaliser and got the reward six minutes from time, Balogun converting from close range after a scramble in the box.\n\nA point that keeps the unbeaten league start alive.",
  },
  {
    slug: "adeyemi-brace-sinks-marlow",
    title: "Adeyemi brace sinks Marlow under the lights",
    kind: "MATCH_REPORT" as const,
    excerpt: "Two goals from the number nine, one nervy final ten minutes, and three points that keep the unbeaten start alive at Pearson Park.",
    byline: "By Ade Okafor, club media",
    publishedAt: "2026-08-31T18:00:00",
    competition: "FULL TIME · LEAGUE",
    ourScore: 2,
    theirScore: 1,
    startingXi: "Mensah; Coker, Osei, Bello, Nwosu; Yusuf, Balogun, Chukwu; Diallo, Adeyemi, Bassey.",
    subs: "Subs: Farrell, Musa, Eze, Achara, Ibe.",
    body: "OHC FC 2, Marlow Town 1. The floodlights had barely warmed up when Adeyemi opened his account for the night, sliding in at the back post to finish a low cross from Nwosu after 23 minutes. Pearson Park, already loud, got louder.\n\nMarlow came back into it after the break and levelled through a scrambled corner on 58 minutes. For a spell the visitors had the ball and the momentum. Mensah kept it at one with a strong hand at his near post, and Osei headed clear more times than anyone counted.\n\nThen, on 71, the moment. Chukwu found a pocket between the lines, turned, and slipped Adeyemi through. One touch to steady, one to finish. Two–one, and the terrace behind the goal did the rest.",
  },
  {
    slug: "thornbridge-tie-ticket-details",
    title: "Thornbridge tie set for Saturday: ticket details",
    kind: "CLUB_NEWS" as const,
    excerpt: "Gates open at 1:30PM. Terrace tickets on the day, cash or card. Under-16s free with a paying adult.",
    byline: "OHC FC",
    publishedAt: "2026-09-05T09:00:00",
    competition: null,
    ourScore: null,
    theirScore: null,
    startingXi: null,
    subs: null,
    body: "Saturday's League Cup second round tie against Thornbridge Athletic is all set for a 3:00PM kickoff at Pearson Park, with gates opening at 1:30PM.\n\nTerrace tickets are available on the day, cash or card at the turnstiles. Under-16s go free with a paying adult, and the clubhouse bar will be open from midday.\n\nSee you there.",
  },
];

async function main() {
  console.log("Clearing existing squad/fixture/training/news data...");
  await prisma.trainingAttendance.deleteMany();
  await prisma.trainingSession.deleteMany();
  await prisma.newsArticle.deleteMany();
  await prisma.lineupSlot.deleteMany();
  await prisma.fixture.deleteMany();
  await prisma.player.deleteMany();

  console.log("Creating players...");
  const playersByNumber = new Map<number, { id: string }>();
  for (const p of PLAYERS) {
    const created = await prisma.player.create({
      data: { number: p.number, name: p.name, position: p.position, status: p.status, bio: p.bio, active: true },
    });
    playersByNumber.set(p.number, created);
  }

  console.log("Creating fixtures...");
  const fixturesByOpponent = new Map<string, { id: string }>();
  for (const f of FIXTURES) {
    const created = await prisma.fixture.create({
      data: {
        opponent: f.opponent,
        competition: f.competition,
        round: f.round,
        kickoff: new Date(f.kickoff),
        venue: f.venue,
        status: f.status,
        ourScore: f.ourScore,
        theirScore: f.theirScore,
        scorers: f.scorers,
      },
    });
    fixturesByOpponent.set(f.opponent, created);
  }

  console.log("Building the lineup for the next fixture...");
  const nextFixture = fixturesByOpponent.get("Thornbridge Athletic")!;
  const starterNumbers = [1, 2, 4, 5, 3, 6, 8, 10, 7, 9, 11];
  const benchNumbers = [12, 14, 16, 17, 19];
  await prisma.lineupSlot.createMany({
    data: FORMATION_433.map(([label], index) => ({
      fixtureId: nextFixture.id,
      playerId: playersByNumber.get(starterNumbers[index])!.id,
      role: "STARTER" as const,
      slotIndex: index,
      label,
    })),
  });
  await prisma.lineupSlot.createMany({
    data: benchNumbers.map((number, index) => ({
      fixtureId: nextFixture.id,
      playerId: playersByNumber.get(number)!.id,
      role: "BENCH" as const,
      slotIndex: index,
      label: "SUB",
    })),
  });
  await prisma.fixture.update({ where: { id: nextFixture.id }, data: { lineupAnnounced: true } });

  console.log("Creating training sessions and attendance...");
  for (const t of TRAININGS) {
    const session = await prisma.trainingSession.create({
      data: { title: t.title, location: t.location, startsAt: new Date(t.startsAt), recurrence: t.recurrence, notes: t.notes },
    });
    for (const number of t.presentNumbers) {
      await prisma.trainingAttendance.create({
        data: { sessionId: session.id, playerId: playersByNumber.get(number)!.id, status: "PRESENT", markedAt: new Date(t.startsAt) },
      });
    }
    for (const number of t.absentNumbers) {
      await prisma.trainingAttendance.create({
        data: { sessionId: session.id, playerId: playersByNumber.get(number)!.id, status: "ABSENT", markedAt: new Date(t.startsAt) },
      });
    }
  }

  console.log("Creating news articles...");
  for (const n of NEWS) {
    await prisma.newsArticle.create({
      data: {
        slug: n.slug,
        title: n.title,
        kind: n.kind,
        excerpt: n.excerpt,
        body: n.body,
        byline: n.byline,
        publishedAt: new Date(n.publishedAt),
        published: true,
        competition: n.competition,
        ourScore: n.ourScore,
        theirScore: n.theirScore,
        startingXi: n.startingXi,
        subs: n.subs,
      },
    });
  }

  console.log(`Done: ${PLAYERS.length} players, ${FIXTURES.length} fixtures, ${TRAININGS.length} training sessions, ${NEWS.length} news articles.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
