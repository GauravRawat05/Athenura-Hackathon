/**
  server.js
  Entry point for the application. Starts the server and connects to the database.
 */
import app from './app.js'
import connectDB from './database/indexes.js';
import { portNumber } from './utils/config.js'

const port =  portNumber  || 5001

connectDB().then(()=>{
  app.listen(port, ()=>{
        console.log("⚙️  SERVER RUNING ON PORT : ", port)
  })
}).catch((error)=>{
    console.error(error)
})