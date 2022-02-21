module.exports = {
    devServer: {
        proxy: { 
            '/v3': {
                target: 'https://mainnet.infura.io',
                ws: true,
                changeOrigin: true, 
                pathRewrite:{ 
                    '^/api':''

                },
            },
        }
    }
}