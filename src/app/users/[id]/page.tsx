import { userService } from "@/services/user.service";
import { Metadata } from "next";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  console.log("ID meta: ", id);
  
  if (!id) return { title: "User Not Found" };

  try {
    const user = await userService.getUserById(id);
    return {
      title: `${user.name} | User Details`,
    };
  } catch {
    return { title: "User Details" };
  }
}

export default async function UserDetailPage({ params }: Props) {
  const { id } = await params;
  console.log("ID: ", id);
  
  try {
    const user = await userService.getUserById(id);

    return (
      <div className="min-h-screen bg-[#F0F0F0] p-8 font-sans">
        <div className="mx-auto max-w-2xl">
          <Link 
            href="/users" 
            className="mb-6 inline-flex items-center text-sm font-medium text-zinc-600 hover:text-[#E7473C] transition-colors"
          >
            Back to List
          </Link>

          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl">
            <div className="bg-[#E7473C] p-6 text-white">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="opacity-90">@{user.username.toLowerCase()}</p>
            </div>

            <div className="p-8 space-y-8">
              <section>
                <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Contact Information</h2>
                <div className="grid gap-4 text-sm sm:grid-cols-2">
                  <div>
                    <p className="text-zinc-500 text-xs">Email</p>
                    <p className="font-medium text-zinc-900">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-xs">Phone</p>
                    <p className="font-medium text-zinc-900">{user.phone}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-zinc-500 text-xs">Website</p>
                    <a href={`https://${user.website}`} target="_blank" className="font-medium text-[#E7473C] hover:underline">
                      {user.website}
                    </a>
                  </div>
                </div>
              </section>

              <section className="rounded-lg bg-[#F0F0F0] p-4">
                <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-400">Company</h2>
                <p className="text-lg font-bold text-zinc-900">{user.company.name}</p>
                <p className="text-sm text-zinc-600">"{user.company.catchPhrase}"</p>
              </section>

              <section>
                <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Address</h2>
                <div className="text-sm text-zinc-700 space-y-1">
                  <p>{user.address.street}, {user.address.suite}</p>
                  <p className="font-semibold">{user.address.city}, {user.address.zipcode}</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F0F0F0]">
        <h2 className="text-xl font-bold text-zinc-900">User tidak ditemukan</h2>
        <p className="text-zinc-600">ID: {id}</p>
        <Link href="/users" className="mt-4 text-[#E7473C] underline">Kembali ke halaman list users</Link>
      </div>
    );
  }
}