import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import Category from "../models/category.model.js";

config();

const seedCategories =[
  {name:"Художественная литература"},
  {name:"Военная проза"},
  {name:"Историческая проза"},
  {name:"Проза XX века"},
  {name:"Зарубежная литература"},
  {name:"Романтика"},
  {name:"Нобелевская премия"},
  {name:"Рассказы"},
  {name:"Философия"},
]



export const seedDatabase = async () => {
  try {
    await connectDB();

    await Category.insertMany(seedCategories);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};


