const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

