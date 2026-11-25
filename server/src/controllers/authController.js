import bcrypt from 'bcryptjs';
import { prisma } from '../utils/prisma.js';
import { signToken } from '../utils/jwt.js';
import { AppError } from '../utils/errors.js';
import { registerSchema, loginSchema } from '../utils/validation.js';
import { safeUserSelect } from '../utils/listingSerializer.js';

export async function register(req, res, next) {
  try {
    const data = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true },
    });
    if (existing) {
      throw new AppError('An account with this email already exists', 409);
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role,
        phone: data.phone,
      },
      select: safeUserSelect,
    });

    const token = signToken({ userId: user.id, role: user.role });

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: { user, token },
    });
  } catch (err) {
    return next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const userRecord = await prisma.user.findUnique({
      where: { email },
    });

    if (!userRecord) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(password, userRecord.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const { passwordHash: _removed, ...user } = userRecord;
    const token = signToken({ userId: user.id, role: user.role });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { user, token },
    });
  } catch (err) {
    return next(err);
  }
}

export async function getMe(req, res) {
  return res.status(200).json({
    success: true,
    data: { user: req.user },
  });
}
