import type { DocSource } from '../source.js';

export class NoopDocSource implements DocSource {
  name = 'noop';

  pull(_docId: string, _data: Uint8Array) {
    debugger
    console.log("this is pull",_docId,_data)
    return null;
  }

  push(_docId: string, _data: Uint8Array) {
    console.log("this is push",_docId,_data
    )
  }

  subscribe(
    _cb: (docId: string, data: Uint8Array) => void,
    _disconnect: (reason: string) => void
  ) {
    debugger
    return () => {};
  }
}
