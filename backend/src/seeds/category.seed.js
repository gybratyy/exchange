import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import Category from "../models/category.model.js";

config();

const seedCategories =[
  {name:"Fiction"},
  {name:"Non-Fiction"},
  {name:"Mystery"},
  {name:"Fantasy"},
  {name:"Science Fiction"},
  {name:"Romance"},
  {name:"Horror"},
  {name:"Thriller"},
  {name:"Biography"},
  {name:"History"},
  {name:"Self-Help"},
  {name:"Health & Wellness"},
  {name:"Travel"},
  {name:"Philosophy"},
  {name:"Poetry"},
  {name:"Young Adult"},
  {name:"Children's Books"},
  {name:"Religion & Spirituality"},
  {name:"Business & Economics"},
  {name:"Graphic Novels"}
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


