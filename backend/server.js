import express from 'express';

const app = express();
app.listen(5800, () => console.log('server started on 5800'))

app.get('/', (req, res) => {
    res.send('Hello World')
})