import { userService } from "@/services/user.service";
import { Metadata } from "next";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  if (!id) return { title: "User Not Found" };

  try {
    const { user } = await userService.getUserContent(id);
    
    return {
      title: `${user.name} | User Details`,
      description: `Profil dan aktivitas dari ${user.name}`,
    };
  } catch {
    return { title: "User Details" };
  }
}

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user, posts, todos } = await userService.getUserContent(id);

  return (
    <div className="min-h-screen bg-[#F0F0F0] p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        <Link href="/users" className="text-sm font-bold text-[#E7473C] mb-6 block">Back to List</Link>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">{user.name}</h1>
            <p className="text-zinc-500">{user.company.name} • {user.address.city}</p>
          </div>
          <div className="flex gap-2">
             <div className="text-center px-4 py-2 bg-[#F0F0F0] rounded-lg">
                <p className="text-xs font-bold text-zinc-400">POSTS</p>
                <p className="text-lg font-bold text-[#E7473C]">{posts.length}</p>
             </div>
             <div className="text-center px-4 py-2 bg-[#F0F0F0] rounded-lg">
                <p className="text-xs font-bold text-zinc-400">PENDING</p>
                <p className="text-lg font-bold text-[#E7473C]">{todos.filter(t => !t.completed).length}</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Recent Posts</h2>
            <div className="space-y-3">
              {posts.slice(0, 5).map(post => (
                <div key={post.id} className="bg-white p-4 rounded-xl border border-zinc-100 shadow-sm">
                  <h3 className="font-bold text-zinc-900 leading-tight mb-2 capitalize">{post.title}</h3>
                  <p className="text-sm text-zinc-600 line-clamp-2">{post.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Tasks Checklist</h2>
            <div className="bg-white rounded-xl border border-zinc-100 shadow-sm overflow-hidden">
              {todos.map(todo => (
                <div key={todo.id} className="flex items-center gap-3 p-3 border-b border-zinc-50 last:border-0">
                  <div className={`h-2 w-2 rounded-full ${todo.completed ? 'bg-green-500' : 'bg-[#E7473C]'}`} />
                  <span className={`text-sm ${todo.completed ? 'text-zinc-400 line-through' : 'text-zinc-700 font-medium'}`}>
                    {todo.title}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}