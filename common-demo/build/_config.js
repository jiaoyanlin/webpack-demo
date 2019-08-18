let config = {
    isDev: false, // 是否为开发环境
    mode: 'production', // webpack mode：production、development
    domain: '', // API
    env: 'pro', // 对应接口：local、pre、pro
};

module.exports = () => {
    const env = process.env.API_MODE;
    const mode = process.env.NODE_ENV;
    config.isDev = mode === 'development';
    config.mode = mode;
    config.env = env;
    let domain = '';
    switch(env) {
        case 'local': // 本地开发环境接口
            domain = 'local-api.domain.com';
            break;
        case 'pre': // 测试环境接口
            domain = 'pre-api.domain.com';
            break;
        default: // 正式环境接口
            domain = 'api.domain.com';
    }
    config.domain = domain;
    return config;
};
