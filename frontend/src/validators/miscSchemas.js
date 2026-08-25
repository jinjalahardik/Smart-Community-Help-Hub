import { z } from 'zod';

export const inventorySchema = z.object({
  category: z.string().min(1, 'Category is required'),
  itemName: z.string().min(2, 'Item name is required'),
  quantity: z.coerce.number().min(0, 'Quantity cannot be negative'),
  unit: z.string().min(1, 'Unit is required'),
  expiryDate: z.string().optional(),
  lowStockThreshold: z.coerce.number().min(0, 'Threshold is required'),
});

export const feedbackSchema = z.object({
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Please share more detail (min 10 characters)'),
  rating: z.coerce.number().min(1).max(5),
});

export const taskCreateSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  priority: z.string().min(1, 'Priority is required'),
  pickupLocation: z.string().min(3, 'Pickup location is required'),
  deliveryLocation: z.string().min(3, 'Delivery location is required'),
  contactInfo: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  instructions: z.string().optional(),
});

export const profileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  city: z.string().min(1, 'City is required'),
});
