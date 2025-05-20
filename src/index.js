import dotenv from "dotenv"
import connectDB from "./db/index.js"
import {app} from "./app.js"
dotenv.config()
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

console.log("jhjhj")
connectDB()
.then(()=>{
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    }); 
})
.catch((error)=>{
    console.log( error)
})
