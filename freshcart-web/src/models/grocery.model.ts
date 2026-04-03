import mongoose from "mongoose";

interface IGrocery {
  _id: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: number;
  unit: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GrocerySchema = new mongoose.Schema<IGrocery>(
  {
    name: { type: String, required: true },

    category: {
      type: String,
      enum: [
        "fruits",
        "vegetables",
        "dairy",
        "eggs",
        "atta",
        "rice",
        "snacks",
        "biscuits",
        "spices",
        "masalas",
        "beverages",
        "personalcare",
        "household",
        "instantfood",
        "babycare",
        "petcare",
        "bakery",
        "dryfruits",
        "frozenfood",
      ],
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    unit: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

const Grocery =
  mongoose.models.Grocery || mongoose.model("Grocery", GrocerySchema);

export default Grocery;
