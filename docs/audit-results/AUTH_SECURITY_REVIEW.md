# Authentication Security Audit

**Last Audit Date**: 2026-02-02
**Auditor**: Auth Security Agent

## Executive Summary

The DevStash authentication implementation demonstrates a solid foundation with proper password hashing using bcrypt, cryptographically secure token generation, and good email enumeration protection on password reset and verification resend endpoints. However, there are several areas requiring attention: the bcrypt work factor is below current OWASP recommendations, there is no rate limiting on any authentication endpoints, password reset does not invalidate existing sessions, and there is a potential race condition in token verification flows.

## Findings

### High Severity

#### 1. No Rate Limiting on Authentication Endpoints

**Severity**: High
**Files**:

- `/Users/bradtraversy/Code/devstash/src/app/api/auth/register/route.ts`
- `/Users/bradtraversy/Code/devstash/src/app/api/auth/forgot-password/route.ts`
- `/Users/bradtraversy/Code/devstash/src/app/api/auth/resend-verification/route.ts`
- `/Users/bradtraversy/Code/devstash/src/auth.ts` (credentials provider)

**Problem**: None of the authentication endpoints implement rate limiting. This exposes the application to multiple attack vectors.

**Attack Scenarios**:

1. **Brute Force Login**: Attacker can attempt unlimited password guesses against known email addresses
2. **Registration Spam**: Attacker can create unlimited accounts, potentially overwhelming the email system
3. **Password Reset Email Bombing**: Attacker can flood a victim's inbox with password reset emails
4. **Verification Email Spam**: Attacker can trigger unlimited verification emails

**Fix**: Implement rate limiting using a library like `@upstash/ratelimit` with Redis or use Next.js middleware with in-memory rate limiting for simpler deployments.

```typescript
// Example using @upstash/ratelimit
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "60 s"), // 5 requests per 60 seconds
  analytics: true,
});

// In your route handler:
const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
const { success, limit, reset, remaining } = await ratelimit.limit(ip);

if (!success) {
  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    { status: 429 }
  );
}
```

---

#### 2. Password Reset Does Not Invalidate Existing Sessions

**Severity**: High
**File**: `/Users/bradtraversy/Code/devstash/src/app/api/auth/reset-password/route.ts`
**Line(s)**: 70-80

**Vulnerable Code**:

```typescript
// Hash the new password
const hashedPassword = await bcrypt.hash(password, 10)

// Update user's password
await prisma.user.update({
  where: { id: user.id },
  data: { password: hashedPassword },
})

// Delete the used token
await deletePasswordResetToken(token)
```

**Problem**: After a password reset, existing sessions remain valid. If an attacker has compromised a user's session (or the password was changed because of a suspected compromise), they can continue using the old session.

**Attack Scenario**:

1. Attacker steals user's session token
2. User notices suspicious activity and resets password
3. Attacker's session remains valid and they continue to have access

**Fix**: Delete all existing sessions for the user after password reset:

```typescript
// Hash the new password
const hashedPassword = await bcrypt.hash(password, 12)

// Update user's password AND invalidate all sessions
await prisma.$transaction([
  prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  }),
  prisma.session.deleteMany({
    where: { userId: user.id },
  }),
]);

// Delete the used token
await deletePasswordResetToken(token)
```

**Note**: Since this application uses JWT strategy (`session: { strategy: 'jwt' }`), session invalidation requires additional work. Consider adding a `passwordChangedAt` field to the User model and checking it in the JWT callback to invalidate tokens issued before the password change.

---

### Medium Severity

#### 3. Bcrypt Work Factor Below OWASP Recommendation

**Severity**: Medium
**Files**:

- `/Users/bradtraversy/Code/devstash/src/app/api/auth/register/route.ts` (line 49)
- `/Users/bradtraversy/Code/devstash/src/app/api/auth/change-password/route.ts` (line 58)
- `/Users/bradtraversy/Code/devstash/src/app/api/auth/reset-password/route.ts` (line 71)

**Vulnerable Code**:

```typescript
const hashedPassword = await bcrypt.hash(password, 10)
```

**Problem**: The bcrypt work factor of 10 is below OWASP's current recommendation of 12+ for 2024-2025. While 10 was acceptable in earlier years, computing power has increased significantly.

**Fix**: Increase the work factor to 12:

```typescript
const hashedPassword = await bcrypt.hash(password, 12)
```

**Note**: Test that authentication time remains acceptable (<1 second) after this change.

---

#### 4. No Maximum Password Length Validation

**Severity**: Medium
**Files**:

- `/Users/bradtraversy/Code/devstash/src/app/api/auth/register/route.ts`
- `/Users/bradtraversy/Code/devstash/src/app/api/auth/change-password/route.ts`
- `/Users/bradtraversy/Code/devstash/src/app/api/auth/reset-password/route.ts`

**Problem**: No maximum password length is enforced. This creates two issues:

1. **DoS via Hashing Exhaustion**: Extremely long passwords (e.g., 1MB) can cause CPU exhaustion during bcrypt hashing
2. **Silent Truncation**: Bcrypt silently truncates passwords at 72 bytes, which users are not aware of

**Attack Scenario**: Attacker sends registration/password change requests with 1MB passwords, pinning server CPU at 100% and causing denial of service.

**Fix**: Add maximum password length validation (128 characters is a good balance):

```typescript
if (password.length < 8) {
  return NextResponse.json(
    { error: 'Password must be at least 8 characters' },
    { status: 400 }
  )
}

if (password.length > 128) {
  return NextResponse.json(
    { error: 'Password must not exceed 128 characters' },
    { status: 400 }
  )
}
```

---

#### 5. Email Enumeration via Registration Endpoint

**Severity**: Medium
**File**: `/Users/bradtraversy/Code/devstash/src/app/api/auth/register/route.ts`
**Line(s)**: 41-46

**Vulnerable Code**:

```typescript
if (existingUser) {
  return NextResponse.json(
    { error: 'User with this email already exists' },
    { status: 400 }
  )
}
```

**Problem**: The registration endpoint reveals whether an email is already registered. This enables user enumeration attacks.

**Attack Scenario**: Attacker submits registration requests with various emails to build a list of valid user accounts. This list can be used for targeted phishing or credential stuffing attacks.

**Fix**: Return a generic message and send an email to the address instead:

```typescript
if (existingUser) {
  // Send an email to the existing user informing them of the registration attempt
  // Return the same success message to prevent enumeration
  return NextResponse.json(
    {
      success: true,
      message: 'Please check your email to verify your account',
    },
    { status: 201 }
  )
}
```

**Note**: This is a tradeoff between UX and security. Many applications accept the enumeration risk for better user experience. Consider your threat model when deciding.

---

#### 6. Race Condition in Token Verification

**Severity**: Medium
**File**: `/Users/bradtraversy/Code/devstash/src/app/api/auth/verify/route.ts`
**Line(s)**: 17-63

**Vulnerable Code**:

```typescript
const verificationToken = await getVerificationToken(token)
// ... validation ...
// Update user's emailVerified timestamp
await prisma.user.update({
  where: { id: user.id },
  data: { emailVerified: new Date() },
})
// Delete the used token
await deleteVerificationToken(token)
```

**Problem**: The token lookup, user update, and token deletion are not atomic. In a race condition, the same token could be used multiple times before deletion completes.

**Attack Scenario**: While unlikely to cause direct harm in email verification, similar patterns in password reset could allow an attacker to use a reset token multiple times in rapid succession.

**Fix**: Use a database transaction to make the operations atomic:

```typescript
await prisma.$transaction(async (tx) => {
  const verificationToken = await tx.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken) {
    throw new Error('Invalid token');
  }

  if (new Date() > verificationToken.expires) {
    await tx.verificationToken.delete({ where: { token } });
    throw new Error('Token expired');
  }

  await tx.user.update({
    where: { email: verificationToken.identifier },
    data: { emailVerified: new Date() },
  });

  await tx.verificationToken.delete({ where: { token } });
});
```

---

### Low Severity

#### 7. Weak Password Complexity Requirements

**Severity**: Low
**File**: `/Users/bradtraversy/Code/devstash/src/app/api/auth/register/route.ts`
**Line(s)**: 29-34

**Current Validation**:

```typescript
if (password.length < 8) {
  return NextResponse.json(
    { error: 'Password must be at least 8 characters' },
    { status: 400 }
  )
}
```

**Problem**: Only minimum length is enforced. Weak passwords like "password" or "12345678" are accepted.

**Recommendation**: Consider adding basic complexity requirements or, preferably, implement password strength checking using a library like `zxcvbn`:

```typescript
import zxcvbn from 'zxcvbn';

const strength = zxcvbn(password);
if (strength.score < 2) {
  return NextResponse.json(
    { error: 'Password is too weak. ' + strength.feedback.suggestions.join(' ') },
    { status: 400 }
  )
}
```

**Note**: This is a UX vs security tradeoff. Strong password requirements can frustrate users but improve security.

---

## Passed Checks

The following security measures were correctly implemented:

- **Password Hashing**: Passwords are properly hashed using bcrypt before storage (never stored in plaintext)
- **Password Never in JWT**: The JWT token only contains id, email, name, and image - password is never exposed
- **Secure Token Generation**: Verification and password reset tokens use `crypto.randomBytes(32)` which provides 256 bits of cryptographically secure randomness
- **Token Expiration**: Verification tokens expire in 24 hours, password reset tokens in 1 hour (appropriate durations)
- **Token Single-Use**: Tokens are deleted after successful use in both verification and password reset flows
- **Email Enumeration Protection (Partial)**: The forgot-password and resend-verification endpoints return generic messages regardless of whether the email exists
- **OAuth Account Linking Protection**: The signIn callback prevents OAuth sign-in if user already has a password-based account, preventing account takeover
- **Session Authentication**: Protected endpoints (`change-password`, `delete-account`) properly validate session before processing
- **User ID from Session**: Sensitive operations use `session.user.id` from the server-side session, not user input
- **Current Password Required**: Password change requires verification of current password
- **Bcrypt Timing-Safe Comparison**: Uses `bcrypt.compare()` which is timing-safe
- **Cascade Deletes**: User deletion properly cascades to related data (configured in Prisma schema)
- **Email Verification Flow**: Users cannot sign in until email is verified (when `SKIP_EMAIL_VERIFICATION` is false)

---

## Recommendations Summary

**Priority 1 (Critical to fix before production)**:

1. Implement rate limiting on all authentication endpoints
2. Increase bcrypt work factor from 10 to 12
3. Add maximum password length validation (128 characters)

**Priority 2 (Should fix soon)**:
4. Invalidate sessions after password reset (add `passwordChangedAt` field for JWT strategy)
5. Use database transactions for token verification flows to prevent race conditions

**Priority 3 (Consider for enhanced security)**:
6. Address email enumeration in registration (security vs UX tradeoff)
7. Implement password strength checking with zxcvbn
8. Consider migrating from bcrypt to Argon2id (OWASP 2025 recommendation)

---

## References

- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [OWASP Top 10 2025 - A04 Cryptographic Failures](https://owasp.org/Top10/2025/A04_2025-Cryptographic_Failures/)
- [The 1MB Password DoS Attack](https://instatunnel.my/blog/the-1mb-password-crashing-backends-via-hashing-exhaustion)
- [Bcrypt 72-Byte Limitation](https://www.monterail.com/blog/more-secure-passwords-bcrypt)
