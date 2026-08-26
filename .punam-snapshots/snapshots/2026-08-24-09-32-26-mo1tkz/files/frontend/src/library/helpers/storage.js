export function load(k,f){try{const r=localStorage.getItem(k);return r==null?f:JSON.parse(r)}catch{return f}}
export function save(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
