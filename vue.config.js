module.exports = {
    devServer: {
        open: process.platform === 'darwin',
        host: '0.0.0.0',
        port: 3000,
        https: false,
        hotOnly: false,
        proxy: {
            '/authenticate': {
                target: 'http://localhost:5000',
                secure: false
            },
            '/api': {
                target: 'http://localhost:5000',
                secure: false
            },
            '/assets': {
                target: 'http://localhost:5000',
                secure: false
            }
        }
    }
}