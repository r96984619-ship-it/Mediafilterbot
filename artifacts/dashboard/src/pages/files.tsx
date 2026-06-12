import { useState, useEffect } from "react";
import { useGetFiles, getGetFilesQueryKey } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function Files() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);
  const limit = 20;

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data, isLoading } = useGetFiles(
    { page, limit, search: debouncedSearch || undefined },
    { query: { queryKey: getGetFilesQueryKey({ page, limit, search: debouncedSearch || undefined }) } }
  );

  const formatSize = (bytes?: number | null) => {
    if (!bytes) return "-";
    const mb = bytes / (1024 * 1024);
    if (mb < 1000) return `${mb.toFixed(1)} MB`;
    return `${(mb / 1024).toFixed(2)} GB`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Indexed Files</h1>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            className="pl-9 bg-card/50 border-border/50 focus-visible:ring-primary/30"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="border border-border/50 rounded-lg overflow-hidden bg-card/50">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead>File Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-border/50">
                  <TableCell><div className="h-4 w-48 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-16 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-5 w-20 bg-muted animate-pulse rounded-full" /></TableCell>
                </TableRow>
              ))
            ) : data?.files.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                  {debouncedSearch ? `No files matching "${debouncedSearch}".` : "No files found."}
                </TableCell>
              </TableRow>
            ) : (
              data?.files.map((file) => (
                <TableRow key={file.id} className="border-border/50 hover:bg-muted/30">
                  <TableCell className="font-medium max-w-[300px] truncate" title={file.file_name || ""}>
                    {file.file_name || "Unknown"}
                    {file.caption && (
                      <div className="text-xs text-muted-foreground mt-1 truncate">{file.caption}</div>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatSize(file.file_size)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-secondary text-secondary-foreground font-normal">
                      {file.mime_type?.split("/")?.[1] || file.mime_type || "unknown"}
                    </Badge>
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
            Page {data.page} of {data.pages} — {data.total.toLocaleString()} total
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
