import { useAppDispatch, useAppSelector } from '../../library/storeHooks.js';
import { updateBook, removeBook } from '../../library/slices/booksSlice.js';
import { formatKES } from '../../library/json/booksData.js';

export function AdminBooks() {
	const books = useAppSelector((state) => state.books.items);
	const dispatch = useAppDispatch();
	return <div><h1 style={{ fontSize: '1.5rem' }}>Books</h1><div className="card" style={{ overflowX: 'auto', marginTop: 24 }}><table style={{ width: '100%', borderCollapse: 'collapse' }}><thead><tr>{['Title', 'Author', 'Genre', 'Price', 'Stock', 'Actions'].map((heading) => <th key={heading} style={{ textAlign: 'left', padding: 12, color: 'var(--muted)', fontSize: 12 }}>{heading}</th>)}</tr></thead><tbody>{books.map((book) => <tr key={book.id}><td style={{ padding: 12 }}>{book.title}</td><td style={{ padding: 12 }}>{book.author}</td><td style={{ padding: 12 }}>{book.genre}</td><td style={{ padding: 12 }}>{formatKES(book.price)}</td><td style={{ padding: 12 }}>{book.stock}</td><td style={{ padding: 12 }}><button type="button" className="btn btn-ghost btn-sm" onClick={() => dispatch(updateBook({ id: book.id, stock: book.stock + 1 }))}>Add stock</button><button type="button" className="btn btn-danger btn-sm" style={{ marginLeft: 8 }} onClick={() => dispatch(removeBook(book.id))}>Delete</button></td></tr>)}{books.length === 0 && <tr><td colSpan="6" style={{ padding: 12, color: 'var(--muted)' }}>No books in the catalogue.</td></tr>}</tbody></table></div></div>;
}
