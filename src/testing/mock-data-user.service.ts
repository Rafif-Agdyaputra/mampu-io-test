export const mockUsers = [
  {
    id: 1,
    name: "Leanne Graham",
    email: "Sincere@april.biz",
    activity: { totalPosts: 2, completedTodos: 5, pendingTodos: 12 }
  },
  {
    id: 2,
    name: "Ervin Howell",
    email: "Shanna@melissa.tv",
    activity: { totalPosts: 1, completedTodos: 0, pendingTodos: 3 }
  }
];

export const mockUserDetail = {
  user: { name: "Leanne Graham", company: { name: "Romaguera" }, address: { city: "Gwenborough" } },
  posts: [{ id: 1, title: "Post 1", body: "Body 1" }],
  todos: [
    { id: 1, title: "Todo 1", completed: false },
    { id: 2, title: "Todo 2", completed: true }
  ]
};