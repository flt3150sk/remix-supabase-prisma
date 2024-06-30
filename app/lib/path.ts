export const path = {
  admin: {
    userIndex: "/admin/users",
    beverageIndex: "/admin/beverages",
    beverageNew: "/admin/beverages/new",
    beverageEdit: (beverageId: number) => `/admin/beverages/${beverageId}/edit`,
    snackIndex: "/admin/snacks",
  },
};
