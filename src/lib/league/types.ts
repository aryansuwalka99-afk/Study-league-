export type Role = "admin" | "participant";
export type Period = "today" | "week" | "all";
export type Metric = "score" | "study" | "cam";

export type Viewer = {
  userId: string;
  displayName: string;
  role: Role;
  memberId: number | null;
  memberActive: boolean;
  teamId: number | null;
  teamName: string | null;
};

export type Team = {
  id: number;
  name: string;
};

export type Member = {
  id: number;
  userId: string | null;
  displayName: string;
  teamId: number | null;
  teamName: string | null;
  isActive: boolean;
  isAdmin: boolean;
};

export type DailyLog = {
  id: number;
  memberId: number;
  logDate: string;
  studyMinutes: number;
  camMinutes: number;
  score: number;
  notes: string | null;
};

export type MemberTotals = {
  memberId: number;
  displayName: string;
  teamId: number | null;
  teamName: string | null;
  userId: string | null;
  isAdmin: boolean;
  studyMinutes: number;
  camMinutes: number;
  score: number;
  daysLogged: number;
  rank: number;
};

export type TeamTotals = {
  teamId: number;
  name: string;
  studyMinutes: number;
  camMinutes: number;
  score: number;
  memberCount: number;
  rank: number;
  members: MemberTotals[];
};

export type LeagueSnapshot = {
  viewer: Viewer;
  period: Period;
  metric: Metric;
  rangeStart: string | null;
  rangeEnd: string;
  teams: Team[];
  members: Member[];
  logs: DailyLog[];
  individual: MemberTotals[];
  teamBoard: TeamTotals[];
  unaffiliated: MemberTotals[];
  todayLog: DailyLog | null;
};
