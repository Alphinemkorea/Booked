
const EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
export function isValidEmail(e){return EMAIL.test(String(e||"").trim())}
export function isStrongPassword(p){return typeof p==="string"&&p.length>=6}
export function validateLogin({email,password}){const o={};if(!isValidEmail(email))o.email="Enter a valid email address.";if(!password)o.password="Password is required.";return o}
export function validateRegister({name,email,password,confirm}){const o={};if(!name||name.trim().length<2)o.name="Enter your full name (min 2 characters).";if(!isValidEmail(email))o.email="Enter a valid email address.";if(!isStrongPassword(password))o.password="Password must be at least 6 characters.";if(confirm!==undefined&&password!==confirm)o.confirm="Passwords do not match.";return o}
export function validateMpesaPhone(p){return /^(?:254|0)?[17]\d{8}$/.test(String(p||"").replace(/\s+/g,""))}
export function toMpesaMsisdn(phone){let p=String(phone).replace(/\D/g,"");if(p.startsWith("0"))p="254"+p.slice(1);if(p.length===9)p="254"+p;return p}
