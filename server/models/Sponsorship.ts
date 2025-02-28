import mongoose from 'mongoose';

// 支付状态枚举
export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

// 支付方式枚举
export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  LINE_PAY = 'line_pay',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay'
}

// 赞助记录接口
export interface ISponsorship {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  amount: number;
  message: string;
  paymentMethod: string;
  paymentStatus: string;
  transactionId: string;
  paymentDetails?: Record<string, any>;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// 赞助记录模型
const sponsorshipSchema = new mongoose.Schema<ISponsorship>({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true,
    min: 50
  },
  message: { 
    type: String, 
    default: '' 
  },
  paymentMethod: { 
    type: String, 
    enum: Object.values(PaymentMethod),
    required: true 
  },
  paymentStatus: { 
    type: String, 
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING 
  },
  transactionId: { 
    type: String,
    unique: true
  },
  paymentDetails: { 
    type: mongoose.Schema.Types.Mixed 
  },
  completedAt: { 
    type: Date 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// 创建和导出模型
export const Sponsorship = mongoose.models.Sponsorship || mongoose.model<ISponsorship>('Sponsorship', sponsorshipSchema); 