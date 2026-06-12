import { useGetChats, getGetChatsQueryKey } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function Chats() {
  const { data: chats, isLoading } = useGetChats({ query: { queryKey: getGetChatsQueryKey() } });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Active Chats</h1>
      </div>

      <div className="border border-border/50 rounded-lg overflow-hidden bg-card/50">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead>Chat ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-border/50">
                  <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-32 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-5 w-16 bg-muted animate-pulse rounded-full" /></TableCell>
                </TableRow>
              ))
            ) : !chats || chats.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No active chats found.
                </TableCell>
              </TableRow>
            ) : (
              chats.map((chat) => (
                <TableRow key={chat.id} className="border-border/50 hover:bg-muted/30">
                  <TableCell className="font-mono text-xs text-muted-foreground">{chat.id}</TableCell>
                  <TableCell className="font-medium">{chat.title || "Private Chat"}</TableCell>
                  <TableCell>{chat.username ? <span className="text-primary">@{chat.username}</span> : "-"}</TableCell>
                  <TableCell>
                    {chat.chat_status ? (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Active</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-muted-foreground">Inactive</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
