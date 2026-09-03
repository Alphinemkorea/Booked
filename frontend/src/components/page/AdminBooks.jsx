import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../library/storeHooks.js';
import {
  createBookRemote,
  updateBookRemote,
  removeBookRemote,
  fetchBooks,
} from '../../library/slices/booksSlice.js';
import { pushToast } from '../../library/slices/uiSlice.js';
import { formatKES, GENRES } from '../../library/json/booksData.js';
import { HAS_API } from '../../library/config.js';
import { SafeImage } from '../shared/SafeImage.jsx';
import styles from '../../styles/components/page/AdminDashboard.module.css';

const empty = {
  title: '',
  author: '',
  genre: 'Fiction',
  price: 1000,
  stock: 5,
  forSale: true,
  forLoan: true,
  deposit: 200,
  loanDays: 14,
  cover: '',
  blurb: '',
  rating: 4.5,
  pages: 200,
  isbn: '',
};

export function AdminBooks() {
  const books = useAppSelector((s) => s.books.items);
  const source = useAppSelector((s) => s.books.source);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(null);

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, cover: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim()) {
      dispatch(pushToast({ message: 'Title and author required', tone: 'info' }));
      return;
    }
    setBusy(true);
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      deposit: Number(form.deposit),
      loanDays: Number(form.loanDays),
      pages: Number(form.pages),
      rating: Number(form.rating),
      cover:
        form.cover ||
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
    };

    try {
      if (editing) {
        await dispatch(updateBookRemote({ id: editing, ...payload })).unwrap();
        dispatch(pushToast({ message: `Updated “${payload.title}”`, tone: 'success' }));
      } else {
        await dispatch(
          createBookRemote({
            ...payload,
            uploadedAt: new Date().toISOString().slice(0, 10),
            reviews: 0,
          })
        ).unwrap();
        dispatch(pushToast({ message: `Added “${payload.title}”`, tone: 'success' }));
      }
      if (HAS_API) await dispatch(fetchBooks());
      setOpen(false);
      setEditing(null);
      setForm(empty);
    } catch (err) {
      dispatch(pushToast({ message: err?.message || String(err) || 'Save failed', tone: 'error' }));
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async (id, title) => {
    if (!window.confirm(`Delete “${title}”?`)) return;
    setBusy(true);
    try {
      await dispatch(removeBookRemote(id)).unwrap();
      dispatch(pushToast({ message: 'Book removed', tone: 'success' }));
      if (HAS_API) await dispatch(fetchBooks());
    } catch (err) {
      dispatch(pushToast({ message: err?.message || 'Delete failed', tone: 'error' }));
    } finally {
      setBusy(false);
    }
  };

  const bumpStock = async (b, delta) => {
    try {
      await dispatch(updateBookRemote({ id: b.id, stock: Math.max(0, (b.stock || 0) + delta) })).unwrap();
    } catch (err) {
      dispatch(pushToast({ message: err?.message || 'Stock update failed', tone: 'error' }));
    }
  };

  return (
    <div>
      <header className={styles.header}>
        <div>
          <h1>Books</h1>
          <p className="u-muted u-fs-13 u-m-0">
            {books.length} titles · source: <strong>{source}</strong>
            {HAS_API ? ' (API)' : ' (local)'}
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setEditing(null);
            setForm(empty);
            setOpen(true);
          }}
        >
          + Add book
        </button>
      </header>

      <div className={`card ${styles.tableWrap}`}>
        <table className={styles.table}>
          <thead>
            <tr>
              {['Cover', 'Title', 'Author', 'Genre', 'Price', 'Stock', 'Actions'].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b.id}>
                <td>
                  <SafeImage src={b.cover} alt="" className="thumb-cover-sm" />
                </td>
                <td>
                  <strong>{b.title}</strong>
                </td>
                <td>{b.author}</td>
                <td>{b.genre}</td>
                <td>{formatKES(b.price)}</td>
                <td>{b.stock}</td>
                <td>
                  <div className="u-flex u-gap-8 u-flex-wrap">
                    <button type="button" className="link-orange" onClick={() => bumpStock(b, 1)}>
                      +Stock
                    </button>
                    <button
                      type="button"
                      className="link-orange"
                      onClick={() => {
                        setEditing(b.id);
                        setForm({ ...empty, ...b });
                        setOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <button type="button" className="link-orange" onClick={() => onDelete(b.id, b.title)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {books.length === 0 && <p className="u-muted u-text-center" style={{ padding: 24 }}>No books yet.</p>}
      </div>

      {open && (
        <div className="overlay" onClick={() => !busy && setOpen(false)} role="presentation">
          <div className={`card ${styles.formGrid}`} style={{ width: 'min(520px, 100%)', padding: 24, display: 'block' }} onClick={(e) => e.stopPropagation()}>
            <h2 className="serif" style={{ marginBottom: 16 }}>{editing ? 'Edit book' : 'Add book'}</h2>
            <form onSubmit={submit} className="u-flex-col u-gap-12">
              <label className="label">Title</label>
              <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <label className="label">Author</label>
              <input className="input" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required />
              <label className="label">Genre</label>
              <select className="input" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })}>
                {GENRES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <div className="u-flex u-gap-12">
                <div className="u-flex-1">
                  <label className="label">Price (KES)</label>
                  <input className="input" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
                <div className="u-flex-1">
                  <label className="label">Stock</label>
                  <input className="input" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
                </div>
              </div>
              <div className="u-flex u-gap-12">
                <div className="u-flex-1">
                  <label className="label">Deposit</label>
                  <input className="input" type="number" value={form.deposit} onChange={(e) => setForm({ ...form, deposit: e.target.value })} />
                </div>
                <div className="u-flex-1">
                  <label className="label">Loan days</label>
                  <input className="input" type="number" value={form.loanDays} onChange={(e) => setForm({ ...form, loanDays: e.target.value })} />
                </div>
              </div>
              <label className="label">Cover image</label>
              <input type="file" accept="image/*" onChange={onFile} />
              <label className="label">Blurb</label>
              <textarea className="input" rows={3} value={form.blurb} onChange={(e) => setForm({ ...form, blurb: e.target.value })} />
              <div className="u-flex u-gap-10">
                <label className="u-flex u-items-center u-gap-6">
                  <input type="checkbox" checked={form.forSale} onChange={(e) => setForm({ ...form, forSale: e.target.checked })} /> For sale
                </label>
                <label className="u-flex u-items-center u-gap-6">
                  <input type="checkbox" checked={form.forLoan} onChange={(e) => setForm({ ...form, forLoan: e.target.checked })} /> For loan
                </label>
              </div>
              <div className="u-flex u-gap-10">
                <button type="button" className="btn btn-ghost" disabled={busy} onClick={() => setOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? 'Saving…' : editing ? 'Update' : 'Add book'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
