exports.initLoader = () => (function() {
        var P = ["\\", "|", "/", "-"];
        var x = 0;
        return setInterval(function() {
          process.stdout.write("\r" + P[x++]);
          x &= 3;
        }, 250);
      })();

exports.stopLoader = (interval) => {
    clearInterval(interval);
}
