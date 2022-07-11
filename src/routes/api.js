const express = require('express')
const router = express.Router()
const axios = require('axios')

// Config Defaults Axios dengan Detail Akun Rajaongkir
axios.defaults.baseURL = 'https://api.rajaongkir.com/starter'
axios.defaults.headers.common['key'] = process.env.ONGKIR_API_KEY
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// Router GET province
router.get('/provinsi', (req, res) => {
    axios.get('/province')
        .then(response => res.json(response.data))
        .catch(err => res.send(err))
})

// Router GET city by province_id
router.get('/kota/:provId', (req, res) => {
    const id = req.params.provId
    axios.get(`/city?province=${id}`)
        .then(response => res.json(response.data))
        .catch(err => res.send(err))
})

// Router GET costs
router.get('/ongkos/:asal/:tujuan/:berat/:kurir', (req, res) => {
    const param = req.params
    axios.post('/cost', {
        origin: param.asal,
        destination: param.tujuan,
        weight: param.berat,
        courier: param.kurir
    })
        .then(response => res.json(response.data))
        .catch(err => res.send(err))
})

module.exports = router