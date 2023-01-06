import * as original from "../../process/Beejs";

import sinon from "sinon";

export let Beejs = original.Beejs;

export function __stub(fnName, fn) {
  sinon.stub(Beejs.prototype, fnName).callsFake(fn);
}
