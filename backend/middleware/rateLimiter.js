import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

export const aiLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 10, 
  message: 'AI generation limit reached. Please try again in a minute.'
});