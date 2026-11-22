import { useState, type FormEvent } from 'react';
import { ApiError, createAccount } from './api';

type Errors = Partial<Record<'code' | 'name' | 'nature' | 'form', string>>;

export function AccountForm({ onCreated }: { onCreated: () => void }) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [nature, setNature] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(): Errors {
    const e: Errors = {};
    if (!/^\d+$/.test(code) || ![1, 2, 4, 6].includes(code.length))
      e.code = 'El código debe ser numérico y de 1, 2, 4 o 6 dígitos';
    if (!name.trim()) e.name = 'El nombre es obligatorio';
    if (code.length === 1 && !nature) e.nature = 'Elige la naturaleza de la clase';
    return e;
  }

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    const local = validate();
    setErrors(local);
    if (Object.keys(local).length > 0) return;

    setSubmitting(true);
    try {
      await createAccount({ code, name: name.trim(), ...(code.length === 1 ? { nature } : {}) });
      setCode('');
      setName('');
      setNature('');
      onCreated();
    } catch (e) {
      if (e instanceof ApiError && e.field && ['code', 'name', 'nature'].includes(e.field))
        setErrors({ [e.field]: e.message });
      else setErrors({ form: e instanceof ApiError ? e.message : 'Error inesperado' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>Crear cuenta</h2>
      <label>
        Código
        <input value={code} onChange={(e) => setCode(e.target.value)} />
      </label>
      {errors.code && <p className="error">{errors.code}</p>}

      <label>
        Nombre
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      {errors.name && <p className="error">{errors.name}</p>}

      {code.length === 1 && (
        <>
          <label>
            Naturaleza
            <select value={nature} onChange={(e) => setNature(e.target.value)}>
              <option value="">Selecciona…</option>
              <option value="debit">Débito</option>
              <option value="credit">Crédito</option>
            </select>
          </label>
          {errors.nature && <p className="error">{errors.nature}</p>}
        </>
      )}

      {errors.form && <p className="error">{errors.form}</p>}
      <button type="submit" disabled={submitting}>
        {submitting ? 'Creando…' : 'Crear'}
      </button>
    </form>
  );
}