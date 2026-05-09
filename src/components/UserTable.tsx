"use client";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  name: string;
  email: string;
  website: string;
}

export default function UsersTable({ initialUsers }: { initialUsers: User[] }) {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const router = useRouter();

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(query);
    }, 200);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const filteredUsers = useMemo(() => {
    return initialUsers
      .filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      });
  }, [search, sortOrder, initialUsers]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Search by name or email..."
          className="w-full max-w-sm rounded-md border border-zinc-300 bg-white p-3 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-500 focus:border-[#E7473C] focus:ring-1 focus:ring-[#E7473C]"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        
        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="w-fit rounded-md bg-[#E7473C] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 active:scale-95"
        >
          Sort by Name {sortOrder === "asc" ? "ASC" : "DESC"}
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-100 text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-6 py-4 font-bold">Name</th>
                <th className="px-6 py-4 font-bold">Email</th>
                <th className="px-6 py-4 font-bold">Website</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id} 
                    onClick={() => router.push(`/users/${user.id}`)}
                    className="cursor-pointer transition-colors hover:bg-[#F0F0F0]/50"
                  >
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-zinc-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-zinc-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <a 
                        href={`https://${user.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-[#E7473C] hover:underline"
                      >
                        {user.website}
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-zinc-400">
                    No matching users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}