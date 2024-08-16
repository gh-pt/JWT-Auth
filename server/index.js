import express from "express";
import cors from "cors";
import "dotenv/config";
import logger from "./logger.js";
import morgan from "morgan";
import connectDB from './src/db/index.js'
import cookieParser from "cookie-parser";
import userRouter from './src/routes/User.router.js'

const morganFormat = ":method :url :status :response-time ms";

const PORT = process.env.PORT || 5000;

const app = express();

// // Morgan middleware
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

// Middleware cors
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// Middleware
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.get('/get',(req,res)=>{
    console.log("got");
    res.send("hello");
});
// MonogDB Connection 
connectDB()
.then(()=>{
    app.listen(PORT,()=>{
        console.log('Server is running on Port: '+PORT);
    })
})
.catch((error)=>{
    console.log("MongoDB Connection Failed !!!",error);
    
})


app.use('/users',userRouter);