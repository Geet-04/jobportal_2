//packages imports
import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import colors from "colors"
import morgan from "morgan"
import mongoose from "mongoose"
import dotenv from "dotenv"
import userRoute from "./routes/userRoute.js"
import companyRoute from "./routes/companyRoute.js"
import jobRoute from "./routes/jobRoute.js"
import applicationRoute from "./routes/applicationRoute.js"
import path from "path";
import { fileURLToPath } from "url";

//files imports
import connectDB from "./config/db.js";

//dot env config
dotenv.config();

//mongodb connection
connectDB();

const PORT = process.env.PORT || 3000;
const app= express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//middleware
app.use(morgan("dev"));  // logs HTTP requests in the console
app.use(express.json()); //Parses incoming JSON request bodies and makes them available as req.body.convert the JSON string into a javascript object in req.body.
app.use(express.urlencoded({extended:true})); //Parses request bodies sent as URL-encoded form data (content-type: application/x-www-form-urlencoded).
app.use(cookieParser()); //Parses cookies from the request header and makes them available as req.cookies.
//Allow requests only from http://localhost:5173.
//Allow cookies/auth headers to be sent with those requests.
//Apply this rule to all routes in your Express app.
const corsOption = {
   origin:'http://localhost:5173',
   credentials: true
}
app.use(cors(corsOption));

//api's
app.use("/api/v1/user", userRoute); 
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// Serve static files
app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));

// Catch-all route (for React frontend)
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "dist", "index.html"));
});

app.listen(PORT, ()=> {
   console.log(`Server Running on port ${PORT}`);
})