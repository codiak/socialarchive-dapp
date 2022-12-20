import * as original from "../../process/Beejs";

import sinon from "sinon";

export let Beejs = class{ };
// export let Beejs = original.Beejs;

export function __stub(fn) {
  return Beejs = fn;
}
