// code away!
const server = require("./server");
const port = process.env.PORT || 3459;
server.listen(port, () => {
  console.log(
    "\n* Welcome back Sir, your server is runing on http://localhost:3459 *\n"
  );
});
