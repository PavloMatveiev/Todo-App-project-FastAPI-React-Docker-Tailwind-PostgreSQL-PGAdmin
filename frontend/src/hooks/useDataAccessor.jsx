import { useEffect, useState } from "react";
import api from "../api";

function join(path, id) {
  return `${path.replace(/\/$/, "")}/${id}`;
}

export default function useDataAccessor(
  path,
  instanceName = "items",
  deleteMessage = "Delete this item?"
) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get(path);
      setData(Array.isArray(res.data) ? res.data : (res.data?.items ?? []));
      setErr("");
    } catch {
      setErr(`Failed to load ${instanceName}`);
    } finally {
      setLoading(false);
    }
  };

  const delData = async (id) => {
    if (!confirm(deleteMessage)) return;
    try {
      await api.delete(join(path, id));
      setData((prev) => prev.filter((x) => x.id !== id));
    } catch {
      alert(`Failed to delete ${instanceName}`);
    }
  };

  useEffect(() => {
    load();
  }, [path]);

  return [loading, data, err, delData];
}
