import useDataAccessor from "../../hooks/useDataAccessor";

export default function AdminTable({
  title,
  path,
  instancesNaming,
  deleteMessage,
  fields,
}) {
  const [loading, rows, error, delRow] = useDataAccessor(path, instancesNaming, deleteMessage);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      {error && <p className="text-rose-600">{error}</p>}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              {fields.map((field) => (
                <th key={field} className="py-2">{field}</th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b">
                {fields.map((field) => (
                  <td key={field}>
                    {field === "complete" || f === "is_active" ? (row[field] ? "Yes" : "No") : String(row[f])}
                  </td>
                ))}
                <td>
                  <button
                    onClick={() => delRow(row.id)}
                    className="rounded px-3 py-1 bg-rose-600 text-white hover:bg-rose-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={fields.length + 1} className="py-6 text-center text-sm opacity-70">
                  No {instancesNaming}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
