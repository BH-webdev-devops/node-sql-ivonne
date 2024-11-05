import express, {Request, Response, NextFunction} from 'express'
import 'dotenv/config'
import cors from 'cors'
import userRoutes from "./routes/userRoutes";
import pool from './db/database'
 
const PORT = process.env.PORT

const app = express()
app.use(express.json());
app.use(express.urlencoded({extended : true}))
app.use("/api", userRoutes);

app.use(cors())


app.get(`/`, (req : Request, res: Response) => {
    res.send(`Welcome to our API`)
})

const startServer = async () => {
    try{
        // Test the connection to the database
        const client = await pool.connect();
        console.log("✅ Database connected successfully");

        client.release(); // Release the client back to the pool

        // userRouter used after the connection succeed
        app.use('/api', userRoutes)
        // we start the http server
        app.listen(PORT, () =>  console.log(`Server running on port ${PORT}`))
    }
    catch(err){
        console.error("❌ Failed to connect to the database", err);
    }
}

startServer()