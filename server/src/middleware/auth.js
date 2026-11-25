import { prisma } from '../utils/prisma.js';
import { verifyToken } from '../utils/jwt.js';
import { AppError } from '../utils/errors.js';
import { safeUserSelect } from '../utils/listingSerializer.js';

async function resolveUserFromHeader(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.slice(7).trim();
  if (!token) return null;

  const decoded = verifyToken(token);
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: safeUserSelect,
  });
  return user;
}

export async function authenticate(req, _res, next) {
  try {
    const user = await resolveUserFromHeader(req.headers.authorization);
    if (!user) {
      return next(new AppError('Authentication required. Please log in.', 401));
    }
    req.user = user;
    return next();
  } catch {
    return next(new AppError('Invalid or expired authentication token', 401));
  }
}

export async function optionalAuth(req, _res, next) {
  try {
    req.user = await resolveUserFromHeader(req.headers.authorization);
  } catch {
    req.user = null;
  }
  return next();
}

export function authorize(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    return next();
  };
}
