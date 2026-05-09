export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export interface UserActivity {
  totalPosts: number;
  completedTodos: number;
  pendingTodos: number;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: { name: string; catchPhrase: string };
  address: { street: string; suite: string; city: string; zipcode: string };
  activity?: UserActivity;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const userService = {
  
async getAllUsers(): Promise<User[]> {
    const [usersRes, postsRes, todosRes] = await Promise.all([
      fetch(`${BASE_URL}/users`),
      fetch(`${BASE_URL}/posts`),
      fetch(`${BASE_URL}/todos`),
    ]);

    if (!usersRes.ok || !postsRes.ok || !todosRes.ok) throw new Error("Failed fetching data");

    const users: User[] = await usersRes.json();
    const posts: Post[] = await postsRes.json();
    const todos: Todo[] = await todosRes.json();

    return users.map(user => ({
      ...user,
      activity: {
        totalPosts: posts.filter(p => p.userId === user.id).length,
        completedTodos: todos.filter(t => t.userId === user.id && t.completed).length,
        pendingTodos: todos.filter(t => t.userId === user.id && !t.completed).length,
      }
    }));
  },

  async getUserContent(id: string) {
    const [userRes, postsRes, todosRes] = await Promise.all([
      fetch(`${BASE_URL}/users/${id}`),
      fetch(`${BASE_URL}/posts?userId=${id}`),
      fetch(`${BASE_URL}/todos?userId=${id}`),
    ]);

    if (!userRes.ok) throw new Error("User not found");

    return {
      user: await userRes.json() as User,
      posts: await postsRes.json() as Post[],
      todos: await todosRes.json() as Todo[],
    };
  }

};