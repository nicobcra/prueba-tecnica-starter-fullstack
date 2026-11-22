import { useState } from 'react';
import { ApiError, deleteAccount, type AccountNode } from './api';

function Node({ node, onChanged }: { node: AccountNode; onChanged: () => void }) {
  const [open, setOpen] = useState(node.level === 'class');
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const hasChildren = node.children.length > 0;

  async function handleDelete() {
    if (!window.confirm(`¿Eliminar la cuenta ${node.code} - ${node.name}?`)) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteAccount(node.code);
      onChanged();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Error inesperado');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <li>
      <div className="row">
        <button className="toggle" onClick={() => setOpen(!open)} disabled={!hasChildren}
          aria-label={open ? 'Colapsar' : 'Expandir'}>
          {hasChildren ? (open ? '▾' : '▸') : '·'}
        </button>
        <strong>{node.code}</strong> <span>{node.name}</span>
        <small> ({node.level}, {node.nature === 'debit' ? 'débito' : 'crédito'})</small>
        <button onClick={handleDelete} disabled={deleting}>
          {deleting ? 'Eliminando…' : 'Eliminar'}
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      {open && hasChildren && (
        <ul>
          {node.children.map((c) => (
            <Node key={c.code} node={c} onChanged={onChanged} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function AccountTree({ nodes, onChanged }: { nodes: AccountNode[]; onChanged: () => void }) {
  if (nodes.length === 0) return <p>El catálogo está vacío.</p>;
  return (
    <ul className="tree">
      {nodes.map((n) => (
        <Node key={n.code} node={n} onChanged={onChanged} />
      ))}
    </ul>
  );
}