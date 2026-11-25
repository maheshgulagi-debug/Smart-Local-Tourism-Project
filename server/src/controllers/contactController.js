import { prisma } from '../utils/prisma.js';
import { contactSchema } from '../utils/validation.js';

export async function submitContactMessage(req, res, next) {
  try {
    const data = contactSchema.parse(req.body);

    const contactMessage = await prisma.contactMessage.create({
      data,
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Our local team will reply shortly.',
      data: { contactMessage },
    });
  } catch (err) {
    return next(err);
  }
}
