exports.initLoader = () => (function() {
  const P = ["\\", "|", "/", "-"];
  let i = 0;
  return setInterval(function() {
    process.stdout.write("\r" + P[i++]);
    i &= 3;
  }, 250);
})();

exports.stopLoader = (interval) => {
    clearInterval(interval);
}
