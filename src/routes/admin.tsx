import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { LogForm } from "@/components/log-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  adminAddMember,
  adminAddTeam,
  adminDeleteTeam,
  adminRemoveMember,
  adminRenameTeam,
  adminSetRole,
  adminUpdateMember,
  adminUpsertLog,
} from "@/lib/league/api";
import { useLeague, useMe } from "@/lib/league/hooks";
import type { DailyLog, Member } from "@/lib/league/types";
import { localToday } from "@/lib/utils";

export const Route = createFileRoute("/admin")({ component: AdminPage });

function AdminPage() {
  const today = localToday();
  const me = useMe();
  const league = useLeague("all", "score", today);
  const viewer = league.data?.viewer ?? me.data;

  if (me.isPending || league.isPending) {
    return (
      <AppShell isAdmin>
        <Skeleton className="h-24 w-64" />
        <Skeleton className="mt-4 h-96 w-full rounded-xl" />
      </AppShell>
    );
  }

  if (viewer && viewer.role !== "admin") return <Navigate to="/" />;

  return (
    <AppShell isAdmin>
      <div className="mb-6">
        <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">Admin</p>
        <h1 className="mt-1 font-display text-4xl font-medium tracking-tight">League desk</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Add or remove names, create group names, assign teams, and edit anyone’s daily log.
          Participants cannot add names.
        </p>
      </div>
      {league.data ? (
        <div className="grid gap-4">
          <MembersCard members={league.data.members} teamOptions={league.data.teams} />
          <TeamsCard teams={league.data.teams} />
          <EditLogCard members={league.data.members.filter((m) => m.isActive)} logs={league.data.logs} today={today} />
        </div>
      ) : (
        <p className="text-sm text-destructive">Could not load admin tools.</p>
      )}
    </AppShell>
  );
}

function MembersCard({
  members,
  teamOptions,
}: {
  members: Member[];
  teamOptions: { id: number; name: string }[];
}) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [teamId, setTeamId] = useState<string>("");
  const [editing, setEditing] = useState<Member | null>(null);
  const [editName, setEditName] = useState("");
  const [editTeam, setEditTeam] = useState<string>("");

  const invalidate = () => queryClient.invalidateQueries();

  const add = useMutation({
    mutationFn: adminAddMember,
    onSuccess: async () => {
      toast.success("Name added");
      setName("");
      setTeamId("");
      await invalidate();
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not add"),
  });
  const update = useMutation({
    mutationFn: adminUpdateMember,
    onSuccess: async () => {
      toast.success("Saved");
      setEditing(null);
      await invalidate();
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not save"),
  });
  const remove = useMutation({
    mutationFn: adminRemoveMember,
    onSuccess: async () => {
      toast.success("Removed from the board");
      await invalidate();
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not remove"),
  });
  const setRole = useMutation({
    mutationFn: adminSetRole,
    onSuccess: async () => {
      toast.success("Role updated");
      await invalidate();
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not update role"),
  });

  const active = members.filter((m) => m.isActive);
  const inactive = members.filter((m) => !m.isActive);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Names</CardTitle>
        <CardDescription>
          Add people who are not signed up yet, or tidy names already on the board.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5">
        <form
          className="grid gap-2 sm:grid-cols-[1fr_10rem_auto]"
          onSubmit={(e) => {
            e.preventDefault();
            add.mutate({
              data: {
                displayName: name,
                teamId: teamId ? Number(teamId) : null,
              },
            });
          }}
        >
          <Input
            placeholder="Add a name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <NativeSelect value={teamId} onChange={(e) => setTeamId(e.target.value)}>
            <option value="">No group</option>
            {teamOptions.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </NativeSelect>
          <Button type="submit" disabled={add.isPending}>
            Add name
          </Button>
        </form>

        <ul className="divide-y divide-border rounded-lg border border-border">
          {active.map((m) => (
            <li key={m.id} className="flex flex-col gap-2 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate font-medium">{m.displayName}</p>
                <p className="text-xs text-muted-foreground">
                  {m.teamName ?? "Ungrouped"}
                  {m.userId ? " · Account" : " · Roster"}
                  {m.isAdmin ? " · Admin" : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setEditing(m);
                    setEditName(m.displayName);
                    setEditTeam(m.teamId ? String(m.teamId) : "");
                  }}
                >
                  Edit
                </Button>
                {m.userId ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setRole.mutate({
                        data: { userId: m.userId!, role: m.isAdmin ? "participant" : "admin" },
                      })
                    }
                  >
                    {m.isAdmin ? "Make participant" : "Make admin"}
                  </Button>
                ) : null}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => remove.mutate({ data: { memberId: m.id } })}
                >
                  Remove
                </Button>
              </div>
            </li>
          ))}
          {active.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">No names yet.</li>
          ) : null}
        </ul>

        {inactive.length > 0 ? (
          <div>
            <p className="mb-2 text-xs tracking-wide text-muted-foreground uppercase">Removed</p>
            <ul className="grid gap-2">
              {inactive.map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">{m.displayName}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      update.mutate({ data: { memberId: m.id, isActive: true } })
                    }
                  >
                    Restore
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>

      <Dialog open={Boolean(editing)} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit name</DialogTitle>
            <DialogDescription>Rename and assign a group.</DialogDescription>
          </DialogHeader>
          <form
            className="grid gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (!editing) return;
              update.mutate({
                data: {
                  memberId: editing.id,
                  displayName: editName,
                  teamId: editTeam ? Number(editTeam) : null,
                },
              });
            }}
          >
            <div className="grid gap-1.5">
              <Label htmlFor="edit-name">Name</Label>
              <Input id="edit-name" value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="edit-team">Group</Label>
              <NativeSelect id="edit-team" value={editTeam} onChange={(e) => setEditTeam(e.target.value)}>
                <option value="">No group</option>
                {teamOptions.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </NativeSelect>
            </div>
            <Button type="submit" disabled={update.isPending}>
              Save
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function TeamsCard({ teams }: { teams: { id: number; name: string }[] }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [renaming, setRenaming] = useState<{ id: number; name: string } | null>(null);

  const add = useMutation({
    mutationFn: adminAddTeam,
    onSuccess: async () => {
      toast.success("Group added");
      setName("");
      await queryClient.invalidateQueries();
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not add group"),
  });
  const rename = useMutation({
    mutationFn: adminRenameTeam,
    onSuccess: async () => {
      toast.success("Group renamed");
      setRenaming(null);
      await queryClient.invalidateQueries();
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not rename"),
  });
  const del = useMutation({
    mutationFn: adminDeleteTeam,
    onSuccess: async () => {
      toast.success("Group removed");
      await queryClient.invalidateQueries();
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not remove group"),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Groups</CardTitle>
        <CardDescription>Team names used on the challenge ranking. Members stay when a group is deleted.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form
          className="flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            add.mutate({ data: { name } });
          }}
        >
          <Input
            placeholder="New group name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Button type="submit" disabled={add.isPending}>
            Add group
          </Button>
        </form>
        <ul className="divide-y divide-border rounded-lg border border-border">
          {teams.map((t) => (
            <li key={t.id} className="flex items-center justify-between gap-3 px-3 py-3">
              {renaming?.id === t.id ? (
                <form
                  className="flex w-full flex-col gap-2 sm:flex-row"
                  onSubmit={(e) => {
                    e.preventDefault();
                    rename.mutate({ data: { teamId: t.id, name: renaming.name } });
                  }}
                >
                  <Input
                    value={renaming.name}
                    onChange={(e) => setRenaming({ id: t.id, name: e.target.value })}
                  />
                  <Button type="submit" size="sm">
                    Save
                  </Button>
                </form>
              ) : (
                <>
                  <span className="font-medium">{t.name}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => setRenaming(t)}>
                      Rename
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => del.mutate({ data: { teamId: t.id } })}
                    >
                      Remove
                    </Button>
                  </div>
                </>
              )}
            </li>
          ))}
          {teams.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">No groups yet.</li>
          ) : null}
        </ul>
      </CardContent>
    </Card>
  );
}

function EditLogCard({
  members,
  logs,
  today,
}: {
  members: Member[];
  logs: DailyLog[];
  today: string;
}) {
  const queryClient = useQueryClient();
  const [memberId, setMemberId] = useState<string>(members[0] ? String(members[0].id) : "");
  const [date, setDate] = useState(today);
  const selected = useMemo(() => {
    const id = Number(memberId);
    return logs.find((l) => l.memberId === id && l.logDate === date) ?? null;
  }, [logs, memberId, date]);

  const save = useMutation({
    mutationFn: adminUpsertLog,
    onSuccess: async () => {
      toast.success("Log updated");
      await queryClient.invalidateQueries();
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not edit log"),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit a log</CardTitle>
        <CardDescription>Change anyone’s study, cam time, or score for a day.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor="log-member">Person</Label>
            <NativeSelect
              id="log-member"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.displayName}
                </option>
              ))}
            </NativeSelect>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="admin-date">Date</Label>
            <Input
              id="admin-date"
              type="date"
              max={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>
        {memberId ? (
          <LogForm
            key={`${memberId}-${date}-${selected?.id ?? "new"}`}
            today={today}
            initial={selected ? { ...selected, logDate: date } : { id: 0, memberId: Number(memberId), logDate: date, studyMinutes: 0, camMinutes: 0, score: 0, notes: null }}
            showDate={false}
            submitting={save.isPending}
            submitLabel="Save log"
            onSubmit={(values) =>
              save.mutate({
                data: {
                  memberId: Number(memberId),
                  date,
                  today,
                  studyMinutes: values.studyMinutes,
                  camMinutes: values.camMinutes,
                  score: values.score,
                  notes: values.notes,
                },
              })
            }
          />
        ) : (
          <p className="text-sm text-muted-foreground">Add a name first.</p>
        )}
      </CardContent>
    </Card>
  );
}
