function a (cb){
    setTimeout(cb, 1000)
    console.log("proses a");
}
a(function(){
    console.log("cb")
})
console.log("tes")