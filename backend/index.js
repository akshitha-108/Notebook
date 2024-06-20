const connectToMongo = require('./db');
const express = require('express')
const app = express()
const port = 5000
connectToMongo();

app.use(express.json())
//available routes
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })
app.use('/api/auth',require('./routes/auth'))

app.use('/api/notes',require('./routes/notes'))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})