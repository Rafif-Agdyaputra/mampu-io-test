export interface User {
  id: number;
  name: string;
  email: string;
  website: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const userService = {
  async getAllUsers(): Promise<User[]> {
    try {
      const res = await fetch(`${BASE_URL}/users`, {
        next: { revalidate: 3600 },
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status} - Gagal mengambil data user`);
      }

      return await res.json();
    } catch (error) {
      console.error("User Service Error:", error);
      throw error;
    }
  },

  async getUserById(id: number): Promise<User> {
    const res = await fetch(`${BASE_URL}/users/${id}`);
    if (!res.ok) throw new Error("User tidak ditemukan");
    return res.json();
  }
};