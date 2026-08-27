import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error('BOOOKED error:', error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 48, maxWidth: 520, margin: '10vh auto', fontFamily: 'system-ui,sans-serif', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.4rem' }}>Something went wrong</h1>
          <pre style={{ textAlign: 'left', background: '#f5f5f4', padding: 16, borderRadius: 12, fontSize: 12, overflow: 'auto', color: '#b91c1c' }}>
            {String(this.state.error?.message || this.state.error)}
          </pre>
          <button
            type="button"
            onClick={() => {
              try {
                Object.keys(localStorage).filter((k) => k.startsWith('bk-')).forEach((k) => localStorage.removeItem(k));
              } catch {}
              window.location.href = '/';
            }}
            style={{ marginTop: 16, padding: '12px 20px', borderRadius: 999, border: 'none', background: '#ff5722', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
          >
            Clear app data & reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
