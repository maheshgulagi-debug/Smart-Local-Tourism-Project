import { ZodError } from 'zod';

export function errorHandler(err, _req, res, _next) {
  if (err instanceof ZodError) {
    const errors = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    return res.status(400).json({
      success: false,
      message: errors[0]?.message || 'Validation failed',
      errors,
    });
  }

  if (err?.code === 'P2002') {
    return res.status(409).json({
      success: false,
      message: 'A record with this unique value already exists',
    });
  }

  if (err?.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'Requested record was not found',
    });
  }

  const statusCode = err.statusCode || 500;
  if (statusCode >= 500) {
    console.error('Unhandled server error:', err);
  }

  return res.status(statusCode).json({
    success: false,
    message:
      statusCode >= 500 && process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message || 'Internal server error',
    ...(err.details ? { details: err.details } : {}),
  });
}
