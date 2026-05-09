"use client";
import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function UsersTable({ initialUsers }: { initialUsers: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [filterType, setFilterType] = useState(searchParams.get("filter") || "all");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const filteredUsers = useMemo(() => {
    return initialUsers
      .filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(debouncedQuery.toLowerCase()) || 
                             user.email.toLowerCase().includes(debouncedQuery.toLowerCase());
        
        if (filterType === "pending") return matchesSearch && user.activity.pendingTodos > 10;
        if (filterType === "no-todo") return matchesSearch && user.activity.completedTodos === 0;
        return matchesSearch;
      })
      .sort((a, b) => b.activity.pendingTodos - a.activity.pendingTodos);
  }, [debouncedQuery, filterType, initialUsers]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end bg-white p-4 rounded-xl shadow-sm border border-zinc-200">
        <div className="flex-1 space-y-1">
          <label className="text-xs font-bold text-zinc-400 uppercase">Search</label>
          <input
            type="text"
            className="w-full bg-[#F0F0F0] p-2.5 rounded-md text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:ring-1 focus:ring-[#E7473C]"
            placeholder="Name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-zinc-400 uppercase">Quick Filter</label>
          <select 
            className="w-full bg-[#F0F0F0] p-2.5 rounded-md text-sm text-zinc-900 outline-none"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Users</option>
            <option value="pending">High Pending</option>
            <option value="no-todo">No Completed Tasks</option>
          </select>
        </div>
      </div>

      <div className="hidden md:block overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 border-b text-zinc-500 font-bold uppercase text-[10px]">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Activity Signals</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-[#F0F0F0]/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-zinc-900">{user.name}</p>
                    <p className="text-xs text-zinc-500">{user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3 text-[11px] font-bold">
                      <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full">{user.activity.totalPosts} Posts</span>
                      <span className="bg-green-50 text-green-600 px-2 py-1 rounded-full">{user.activity.completedTodos} Done</span>
                      <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded-full">{user.activity.pendingTodos} Pending</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => router.push(`/users/${user.id}?q=${query}&filter=${filterType}`)}
                      className="text-[#E7473C] font-bold text-xs hover:underline"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-zinc-400">No matching users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredUsers.length > 0 ? (
          filteredUsers.map(user => (
            <div 
              key={user.id} 
              onClick={() => router.push(`/users/${user.id}?q=${query}&filter=${filterType}`)}
              className="bg-white p-4 rounded-xl border border-zinc-200 active:bg-[#F0F0F0]"
            >
              <p className="font-bold text-zinc-900">{user.name}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-bold">
                <span className="border border-zinc-200 px-2 py-1 rounded italic">Posts: {user.activity.totalPosts}</span>
                <span className="bg-green-600 text-white px-2 py-1 rounded">Done: {user.activity.completedTodos}</span>
                <span className="bg-[#E7473C] text-white px-2 py-1 rounded">Pending: {user.activity.pendingTodos}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-8 rounded-xl border border-dashed border-zinc-300 text-center text-zinc-400">
            No matching users found.
          </div>
        )}
      </div>
    </div>
  );
}