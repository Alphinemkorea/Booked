<<<<<<< HEAD
export function load(k,f){try{const r=localStorage.getItem(k);return r==null?f:JSON.parse(r)}catch{return f}}
export function save(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
=======
export function load(k, f) {
  try {
    const r = localStorage.getItem(k);
    return r == null ? f : JSON.parse(r);
  } catch {
    return f;
  }
}
export function save(k, v) {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {
    /* ignore quota */
  }
}
export function remove(k) {
  try {
    localStorage.removeItem(k);
  } catch {
    /* ignore */
  }
}
>>>>>>> fd34775763874bd90ed505782f080973551b04de
