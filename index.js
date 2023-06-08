const beansRoutes = require('./routes/beansRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');

const express = require('express');
const app = express();
const PORT = 1337;

app.use(express.json());
// app.use((req, res, next) => {
// 	console.log(`${req.method}  ${req.url} `, req.body)
// 	next()
// });

app.use('/api/beans', beansRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

app.use('*', (req, res) => {
    res.status(404).send({ message: 'The page you are looking for does not exists.'})
});


app.listen(PORT, () => {
    console.log('Listening on port', PORT);
});
