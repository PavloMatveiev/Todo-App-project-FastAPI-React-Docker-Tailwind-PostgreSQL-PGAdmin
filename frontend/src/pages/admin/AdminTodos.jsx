import AdminTable from "./AdminTable.jsx";

export default function AdminTodos() {
  return (
    <AdminTable
      title="All Todos (admin)"
      path="/admin/todo"
      instancesNaming="todos"
      deleteMessage="Delete this todo?"
      fields={["id", "title", "owner_id", "complete"]}
    />
  );
}
