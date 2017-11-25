import * as Promise from 'promise';

function delay(ms:number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
async function asyncAwait() {
    console.log("Knock, knock!");
    await delay(1000);
    console.log("Who's there?");
    await delay(1000);
    console.log("async/await!");
}
console.log("hello world");
asyncAwait().then(() => {
    console.log("done");
});

console.log("restart?");
