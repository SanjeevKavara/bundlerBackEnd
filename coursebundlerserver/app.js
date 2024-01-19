import express from "express"
import { config } from 'dotenv'
import cookieParser from "cookie-parser";

config({
    path: "./config/config.env"
})
const app = express();


//Using Middlewares

app.use(express.json())
app.use(
    express.urlencoded({
        extended: true,
    })
)

app.use(cookieParser())

//Importing and using Routes

import animes from "./routes/animeRoutes.js"
import user from "./routes/userRoutes.js"
import ErrorMiddleware from "./middlewares/Error.js";

app.use("/api/v1", animes)
app.use("/api/v1", user)

export default app; 



app.use(ErrorMiddleware)
