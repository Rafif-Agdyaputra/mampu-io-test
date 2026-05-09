import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { mockUsers } from "@/testing/mock-data-user.service";
import UsersTable from "./UserTable";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(() => ({ get: () => null })),
}));

describe("Komponen UsersTable", () => {
  const setup = () => render(<UsersTable initialUsers={mockUsers} />);

  it("menampilkan data user beserta aktivitasnya", () => {
    setup();
    expect(screen.getAllByText("Leanne Graham")[0]).toBeInTheDocument();
    
    expect(screen.getAllByText(/12 Pending/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/5 Done/i)[0]).toBeInTheDocument();
  });

  it("menyaring data user berdasarkan input pencarian", async () => {
    setup();
    const input = screen.getByPlaceholderText("Name or email...");
    fireEvent.change(input, { target: { value: "Ervin" } });

    await waitFor(() => {
      expect(screen.getAllByText("Ervin Howell")[0]).toBeInTheDocument();
      expect(screen.queryByText("Leanne Graham")).not.toBeInTheDocument();
    }, { timeout: 500 });
  });

  it("menampilkan pesan 'empty state' jika tidak ada user yang cocok dengan kriteria pencarian", async () => {
    setup();
    const input = screen.getByPlaceholderText("Name or email...");
    fireEvent.change(input, { target: { value: "Unknown User" } });

    await waitFor(() => {
      const emptyMessages = screen.getAllByText(/No matching users found/i);
      expect(emptyMessages[0]).toBeInTheDocument();
      expect(emptyMessages.length).toBeGreaterThan(0);
    });
  });
});