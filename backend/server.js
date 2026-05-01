/**
  server.js
  Entry point for the application. Starts the server and connects to the database.
 */
import app from './src/app.js';
import connectDB from './src/config/db.js';
import envConfig from './src/config/envConfig.js'

const port =  envConfig.portNumber  || 5000

connectDB().then(()=>{
  app.listen(port, ()=>{
        console.log("⚙️  SERVER RUNING ON PORT : ", port)
  })
}).catch((error)=>{
    console.error(error)
})