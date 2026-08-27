<<<<<<< HEAD
export function AdminBooks(){return (<div className="container" style={{padding:48,textAlign:'center'}}><h1 className="serif">AdminBooks</h1><p style={{color:'var(--muted)'}}>Later feature.</p></div>);}
=======
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../library/storeHooks.js';
import { addBook, updateBook, removeBook } from '../../library/slices/booksSlice.js';
import { pushToast } from '../../library/slices/uiSlice.js';
import { formatKES, GENRES } from '../../library/json/booksData.js';

const empty = { title: '', author: '', genre: 'Fiction', price: 1000, stock: 5, forSale: true, forLoan: true, deposit: 200, loanDays: 14, cover: '', blurb: '', rating: 4.5, pages: 200, isbn: '' };

export function AdminBooks() {
  const books = useAppSelector((s) => s.books.items);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, cover: String(reader.result) }));
    reader.readAsDataURL(file);
  };
  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim()) { dispatch(pushToast({ message: 'Title and author required', tone: 'info' })); return; }
    const book = { ...form, id: `b-${Date.now().toString(36)}`, price: Number(form.price), stock: Number(form.stock), deposit: Number(form.deposit), loanDays: Number(form.loanDays), pages: Number(form.pages), rating: Number(form.rating), cover: form.cover || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop', uploadedAt: new Date().toISOString().slice(0, 10), reviews: 0 };
    dispatch(addBook(book));
    dispatch(pushToast({ message: `Added “${book.title}”` }));
    setOpen(false); setForm(empty);
  };
  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.5rem' }}>Books</h1>
        <button type="button" className="btn btn-primary" onClick={() => setOpen(true)}>+ Add book</button>
      </header>
      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead><tr>{['Cover', 'Title', 'Author', 'Genre', 'Price', 'Stock', 'Actions'].map((h) => <th key={h} style={{ textAlign: 'left', padding: 12, fontSize: 11, textTransform: 'uppercase', color: 'var(--muted)', borderBottom: '1px solid var(--line)' }}>{h}</th>)}</tr></thead>
          <tbody>
            {books.map((b) => (
              <tr key={b.id}>
                <td style={{ padding: 12, borderBottom: '1px solid var(--line)' }}><img src={b.cover} alt="" style={{ width: 36, height: 52, objectFit: 'cover', borderRadius: 4 }} /></td>
                <td style={{ padding: 12, borderBottom: '1px solid var(--line)' }}>{b.title}</td>
                <td style={{ padding: 12, borderBottom: '1px solid var(--line)' }}>{b.author}</td>
                <td style={{ padding: 12, borderBottom: '1px solid var(--line)' }}><span className="chip chip-primary">{b.genre}</span></td>
                <td style={{ padding: 12, borderBottom: '1px solid var(--line)' }} className="price">{formatKES(b.price)}</td>
                <td style={{ padding: 12, borderBottom: '1px solid var(--line)' }}>{b.stock}</td>
                <td style={{ padding: 12, borderBottom: '1px solid var(--line)' }}>
                  <button type="button" className="link-orange" style={{ border: 'none', background: 'none', cursor: 'pointer' }} onClick={() => dispatch(updateBook({ id: b.id, stock: b.stock + 1 }))}>+Stock</button>
                  {' · '}
                  <button type="button" style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--danger)', fontWeight: 700 }} onClick={() => { if (window.confirm(`Delete “${b.title}”?`)) { dispatch(removeBook(b.id)); dispatch(pushToast({ message: 'Deleted', tone: 'info' })); } }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {open && (
        <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(28,25,23,.5)', display: 'grid', placeItems: 'center', zIndex: 300, padding: 16 }}>
          <form className="card" onClick={(e) => e.stopPropagation()} onSubmit={submit} style={{ width: 'min(520px,100%)', maxHeight: '90vh', overflow: 'auto', padding: 24 }}>
            <h3 style={{ margin: '0 0 16px', fontFamily: 'var(--font-sans)' }}>Add book</h3>
            <label className="label">Cover image</label>
            <input type="file" accept="image/*" onChange={onFile} />
            {form.cover && <img src={form.cover} alt="" style={{ width: 80, height: 120, objectFit: 'cover', borderRadius: 8, marginTop: 8 }} />}
            <label className="label" style={{ marginTop: 12 }}>Or cover URL</label>
            <input className="input" value={form.cover.startsWith('data:') ? '' : form.cover} onChange={(e) => setForm({ ...form, cover: e.target.value })} placeholder="https://…" />
            {['title', 'author', 'blurb', 'isbn'].map((k) => (
              <div key={k} style={{ marginTop: 12 }}><label className="label">{k}</label><input className="input" value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} required={k === 'title' || k === 'author'} /></div>
            ))}
            <label className="label" style={{ marginTop: 12 }}>Genre</label>
            <select className="input" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })}>{GENRES.map((g) => <option key={g}>{g}</option>)}</select>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
              {[['price', 'Price'], ['stock', 'Stock'], ['deposit', 'Deposit'], ['loanDays', 'Loan days']].map(([k, lab]) => (
                <div key={k}><label className="label">{lab}</label><input className="input" type="number" value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} /></div>
              ))}
            </div>
            <label style={{ display: 'flex', gap: 8, marginTop: 14 }}><input type="checkbox" checked={form.forSale} onChange={(e) => setForm({ ...form, forSale: e.target.checked })} /> For sale</label>
            <label style={{ display: 'flex', gap: 8 }}><input type="checkbox" checked={form.forLoan} onChange={(e) => setForm({ ...form, forLoan: e.target.checked })} /> For loan</label>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
              <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save book</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
>>>>>>> origin/develop
