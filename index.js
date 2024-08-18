const express= require("express");
const dotenv = require('dotenv')
dotenv.config({path: './config.env'})
const app = express()
app.use(express.json());
const employeeRoute= require('./routes/employeesRoutes')
const cors= require('cors')


const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'https://optivacapitals.vercel.app'];

app.use(cors({
    origin: function(origin, callback) {
        // Check if the request origin is in the allowedOrigins array
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

app.use('/api/v1/employees', employeeRoute )


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).send({
        status: 'error',
        message: err.message || 'Internal Server Error',
    });
});

const port =3001

app.listen(port, ()=> console.log(`server listening on port ${port}`))