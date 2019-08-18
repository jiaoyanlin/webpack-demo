import '@static/scss/index.scss';
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
document.querySelector('#app').innerHTML = 'this is a test' + html;
