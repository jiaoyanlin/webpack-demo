import '@static/scss/index.scss';
// src/index.js 新增
if (process.env.CUSTOM_MODE !== 'production') {
    console.log('======================================');
    console.log('CUSTOM_ISDEV:', process.env.CUSTOM_ISDEV);
    console.log('CUSTOM_MODE:', process.env.CUSTOM_MODE);
    console.log('CUSTOM_DOMAIN:', process.env.CUSTOM_DOMAIN);
    console.log('CUSTOM_ENV:', process.env.CUSTOM_ENV);
    console.log('======================================');
}
console.log('-------test1')
const html = +new Date();
const fun = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('ok')
        }, 2000);
    });
}
fun().then(data => {
    console.log('-----data:', data);
});
document.querySelector('#app').innerHTML = 'this is a test' + html + '<div class="block"></div>';
