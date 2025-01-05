import { model, models, Schema} from 'mongoose'

const userSchema = new Schema({

  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },


  portfolio: {
    stocks: [
      {
        assetId: { type: String, required: true }, // ticker
        assetName: { type: String }, 
        quantity: { type: Number, required: true }, 
        value: { type: Number, required: true }, //value when you bought it
        averageCost: { type: Number, required: true }, // quantity * value
        currentValue: { type: Number }, // current value * quantity
        change: { type: Number }, // ((current value / avg cost) - 1) * 100
    
      },
    ],
    crypto: [
      {
        assetId: { type: String, required: true }, 
        assetName: { type: String }, 
        quantity: { type: Number, required: true },
        value: { type: Number, required: true }, 
        averageCost: { type: Number, required: true }, 
        currentValue: { type: Number }, 
        change: { type: Number }, 
      },
    ],
  },

  portfolioValueHistory: {
    stocks: [
      {
        date: { type: Date, default: Date.now }, 
        totalValue: { type: Number, default: 50000 }, 
      },
    ],
    crypto: [
      {
        date: { type: Date, default: Date.now },
        totalValue: { type: Number, default: 50000 }, 
      },
    ],
  },


  financialMetrics: {
    stocks: {
      totalPortfolioValue: { type: Number, default: 50000 }, 
      investmentValue: { type: Number, default: 0 }, 
      remainingFunds: { type: Number, default: 50000 }, 
      roi: { type: Number, default: 0 }, 
    },
    crypto: {
      totalPortfolioValue: { type: Number, default: 50000 }, 
      investmentValue: { type: Number, default: 0 }, 
      remainingFunds: { type: Number, default: 50000 },
      roi: { type: Number, default: 0 }, 
    },
  }
  
},
  {
    timestamps : true,
  }
);

const User = models.investors || model("investors", userSchema);

export default User;