// This script proxies requests to the Mindustry Classic game
const express = require("express")
const path = require("path")
const app = express()

const gameURL = "https://html-classic.itch.zone/html/1597847"

// Serve static files from /web directory first
app.use(express.static(path.join(__dirname, 'web')))

// Proxy all other requests to the game server
app.use(async (req, res, next) => {
    try {
        const fullURL = gameURL + req.path
        const fetched = await fetch(fullURL, {
            headers: req.headers
        })
        
        // Copy response headers
        fetched.headers.forEach((value, name) => {
            if (!['content-encoding'].includes(name.toLowerCase())) {
                res.setHeader(name, value)
            }
        })
        
        res.status(fetched.status)
        
        // Stream the response
        if (fetched.body) {
            fetched.body.pipe(res)
        } else {
            res.end()
        }
    } catch (error) {
        console.error('Proxy error:', error)
        res.status(500).json({ error: 'Proxy error', message: error.message })
    }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`)
})
