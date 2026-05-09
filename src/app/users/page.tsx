import UsersTable from "@/components/UserTable";
import { userService } from "@/services/user.service";
import { Suspense } from "react";

export const metadata = {
  title: "Users List | Dashboard",
};

export default async function UsersPage() {
  const users = await userService.getAllUsers();

  return (
    <div className="min-h-screen bg-[#F0F0F0] p-8 font-sans">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 border-l-4 border-[#E7473C] pl-4">
          <h1 className="text-3xl font-bold text-zinc-900">
            Users
          </h1>
          <p className="text-zinc-600">
            Ini adalah halaman data user
          </p>
        </header>

        <Suspense fallback={<div className="text-[#E7473C] font-medium">Memuat data...</div>}>
          <UsersTable initialUsers={users} />
        </Suspense>
      </div>
    </div>
  );
}