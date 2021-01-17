const express = require('express')
const app = require('./app')
const { PORT } = require('./config')

app.get('/api/*', (req, res) => {
    res.json({ok: true});
});

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})