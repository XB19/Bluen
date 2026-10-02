import { useState } from 'react';
import { api } from './api';

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function toBody(values) {
  if (!Object.values(values).some((v) => v instanceof File)) return values;
  const form = new FormData();
  Object.entries(values).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== '') form.append(k, v);
  });
  return form;
}

export function useForm(initial, { endpoint, validate }) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [serverError, setServerError] = useState('');

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const err = validate(values);
    setErrors(err);
    setServerError('');
    if (Object.keys(err).length) return;
    setStatus('sending');
    try {
      await api(endpoint, { method: 'POST', body: toBody(values) });
      setStatus('done');
    } catch (ex) {
      setErrors(ex.errors || {});
      setServerError(ex.message);
      setStatus('idle');
    }
  };

  const reset = () => {
    setValues(initial);
    setErrors({});
    setStatus('idle');
  };

  return { values, setValues, errors, status, serverError, set, submit, reset };
}
