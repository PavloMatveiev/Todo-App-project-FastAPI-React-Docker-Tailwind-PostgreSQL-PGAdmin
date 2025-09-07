import AdminTable from "./AdminTable.jsx";

export default function AdminUsers() {
  return (
    <AdminTable
      title="Users (admin)"
      path="/admin/users"
      instancesNaming="users"
      deleteMessage="Delete this user and ALL their todos?"
      fields={["id", "username", "email", "role", "is_active"]}
    />
  );
}
