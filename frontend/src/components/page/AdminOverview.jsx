<<<<<<< HEAD
export function AdminOverview(){return (<div className="container" style={{padding:48,textAlign:'center'}}><h1 className="serif">AdminOverview</h1><p style={{color:'var(--muted)'}}>Later feature.</p></div>);}
=======
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../library/storeHooks.js';
import { formatKES } from '../../library/json/booksData.js';

export function AdminOverview() {
  const orders = useAppSelector((s) => s.orders.purchases);
  const loans = useAppSelector((s) => s.orders.loans);
  const books = useAppSelector((s) => s.books.items);
  const po = orders.filter((o) => o.status === 'pending');
  const pl = loans.filter((l) => l.status === 'pending');
  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.5rem' }}>Overview</h1>
        <span className="chip chip-warning">{po.length + pl.length} pending</span>
      </header>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
        {[['Pending orders', po.length], ['Pending loans', pl.length], ['Catalogue', books.length], ['Overdue', loans.filter((l) => l.status === 'active' && l.dueAt && l.dueAt < Date.now()).length]].map(([lab, n]) => (
          <div key={lab} className="card" style={{ padding: 18 }}><div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', fontWeight: 700 }}>{lab}</div><strong style={{ fontSize: '1.85rem', color: 'var(--primary)' }}>{n}</strong></div>
        ))}
      </div>
      {(po.length > 0 || pl.length > 0) && (
        <div style={{ background: 'var(--warning-soft)', borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <strong>Actions needed</strong>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            {po.length > 0 && <Link to="/admin/orders" className="btn btn-ghost btn-sm">{po.length} orders →</Link>}
            {pl.length > 0 && <Link to="/admin/lending" className="btn btn-ghost btn-sm">{pl.length} loans →</Link>}
          </div>
        </div>
      )}
      <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', margin: '28px 0 12px' }}>Recent orders</h2>
      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead><tr>{['Order', 'User', 'Total', 'Status'].map((h) => <th key={h} style={{ textAlign: 'left', padding: 12, fontSize: 11, textTransform: 'uppercase', color: 'var(--muted)', borderBottom: '1px solid var(--line)' }}>{h}</th>)}</tr></thead>
          <tbody>
            {orders.slice(0, 8).map((o) => (
              <tr key={o.id}><td style={{ padding: 12, borderBottom: '1px solid var(--line)' }}>#{o.id}</td><td style={{ padding: 12, borderBottom: '1px solid var(--line)' }}>{o.userName}</td><td style={{ padding: 12, borderBottom: '1px solid var(--line)' }} className="price">{formatKES(o.total)}</td><td style={{ padding: 12, borderBottom: '1px solid var(--line)' }}><span className={`chip chip-${o.status === 'pending' ? 'warning' : o.status === 'paid' ? 'success' : 'info'}`}>{o.status}</span></td></tr>
            ))}
            {orders.length === 0 && <tr><td colSpan={4} style={{ padding: 12, color: 'var(--muted)' }}>No orders yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
>>>>>>> origin/develop
