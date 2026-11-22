import { useCallback, useEffect, useState } from 'react';
import { AccountForm } from './features/accounts/AccountForm';
import { AccountTree } from './features/accounts/AccountTree';
import { getTree, type AccountNode } from './features/accounts/api';

export default function App() {
  const [nodes, setNodes] = useState<AccountNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setNodes(await getTree());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <main style={{ maxWidth: 720, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Catálogo de cuentas</h1>
      <AccountForm onCreated={load} />
      <h2>Árbol</h2>
      {loading && <p>Cargando catálogo…</p>}
      {error && (
        <p className="error">
          {error} <button onClick={load}>Reintentar</button>
        </p>
      )}
      {!loading && !error && <AccountTree nodes={nodes} onChanged={load} />}
    </main>
  );
}