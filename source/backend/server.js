import signale from "signale";

import app from "./app";

app.listen(4000, () => {
  signale.start("Server running on http://localhost:4000");
});
