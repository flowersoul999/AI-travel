import 'dotenv/config';
import express, { application } from 'express';
import travelRouter from './routes/travel.js';
import cors from 'cors';

const app = express()
const port = process.env.PORT

app.use(cors())

app.use(express.json())

app.get('/', (req, res) => {
    res.json({
        message: '旅行推荐服务已启动',
        endpoints: {
            heartbeat: 'POST /heartbeat',
            recommend: 'POST /travel/recommend',
            chat: 'POST /travel/chat'
        }
    });
});

app.post('/heartbeat',(req,res)=>{
    console.log(req.query)
    console.log(req.body)

    res.json({
        message:'服务正常运行',
        timestamp:new Date().toISOString()
    })
})

app.use('/travel',travelRouter)

app.listen(port,()=>{
    console.log(`服务地址 http://localhost:${port}`)
})