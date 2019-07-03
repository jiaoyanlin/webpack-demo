let config = {
    isDev: false, // 开发环境or生产环境
    mode: 'production', // webpack mode：production、development
    domain: '', // API
    env: 'pro', // 所处环境：local、pre、pro
};

module.exports = (env, mode) => {
    config.isDev = mode === 'development';
    config.mode = mode;
    config.env = env.CUSTOM_ENV;
    let domain = '';
    switch(env.CUSTOM_ENV) {
        case 'local': // 本地开发环境
            domain = 'local-api.domain.com';
            break;
        case 'pre': // 测试环境
            domain = 'pre-api.domain.com';
            break;
        default: // 正式环境
            domain = 'api.domain.com';
    }
    config.domain = domain;
    return config;
};
