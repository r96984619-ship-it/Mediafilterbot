import { useState } from "react";
import { useGetUsers, getGetUsersQueryKey } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Users() {
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading } = useGetUsers({ page, limit }, { query: { queryKey: getGetUsersQueryKey({ page, limit }) } });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
      </div>

      <div className="border border-border/50 rounded-lg overflow-hidden bg-card/50">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-border/50">
                  <TableCell><div className="h-4 w-20 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-32 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-5 w-16 bg-muted animate-pulse rounded-full" /></TableCell>
                </TableRow>
              ))
            ) : data?.users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              data?.users.map((user) => (
                <TableRow key={user.id} className="border-border/50 hover:bg-muted/30">
                  <TableCell className="font-mono text-xs text-muted-foreground">{user.id}</TableCell>
                  <TableCell className="font-medium">{user.name || "-"}</TableCell>
                  <TableCell>{user.username ? <span className="text-primary">@{user.username}</span> : "-"}</TableCell>
                  <TableCell>
                    {user.ban_status ? (
                      <Badge variant="destructive" className="bg-destructive/20 text-destructive border-none">Banned</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Active</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {data && data.pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {data.page} of {data.pages}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft className="w-4 h-4 mr-1" /> Prev
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(data.pages, p + 1))} disabled={page === data.pages}>
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
