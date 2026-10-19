# MIRSTOERA — Authentication Architecture Review
**Auditor**: RUDRA (Red Team) & KAVIN (Blue Team)  
**Verification Suite**: `tests/security.test.ts` & `tests/e2e/03_admin_workflow.spec.ts`  
**Verdict**: VERIFIED SECURE  

---

## 1. Password Hashing Specification
- **Algorithm**: `Node.js crypto.scryptSync`
- **Salt**: 16 cryptographically secure random bytes generated via `crypto.randomBytes(16)` per password.
- **Key Length**: 64 bytes (512 bits)
- **Format**: Stored as `salt:derivedKey` in hexadecimal.
- **Verification**: Timing-safe comparison using `crypto.timingSafeEqual` prevents side-channel timing attacks.

```typescript
// Verified implementation in packages/database/src/adapters/index.ts
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

export function verifyPassword(password: string, combinedHash: string): boolean {
  const [salt, key] = combinedHash.split(':');
  if (!salt || !key) return false;
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(Buffer.from(key, 'hex'), derivedKey);
}
```

---

## 2. Session Lifecycle & Token Storage
- **Token Generation**: 32-byte cryptographically secure random string generated via `crypto.randomBytes(32).toString('hex')`.
- **Database Hashing**: The raw token is **never** saved directly in the database. Instead, `hashSessionToken(rawToken)` calculates a SHA-256 hash before storage in `admin_sessions.token_hash`. Even a read-only database leak does not expose valid session tokens.
- **Cookie Security**:
  - `httpOnly: true` (Prevents extraction via XSS)
  - `sameSite: 'lax'` (Defends against Cross-Site Request Forgery)
  - `secure: true` in production environments
  - Cookie name: `momera_admin_session`
- **Session Expiration**: Set to 7 days from creation. Queries explicitly filter `WHERE expires_at > CURRENT_TIMESTAMP`.
- **Session Destruction**: Calling `/api/admin/logout` removes the token hash record from SQLite immediately and clears the cookie header.

---

## 3. Brute Force & Rate Limiting Controls
- Admin login route `/api/admin/login` is governed by `adminLoginRateLimiter`:
  - 10 attempts allowed per 15-minute window per IP.
  - Exceeding the threshold returns HTTP 429 with `{ code: 'TOO_MANY_ATTEMPTS' }`.
- Generic error message: Returns `'Invalid administrative email or password.'` for both non-existent users and incorrect passwords, preventing email enumeration.
