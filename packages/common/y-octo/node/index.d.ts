/* auto-generated by NAPI-RS */
/* eslint-disable */
export declare class Doc {
  constructor(clientId?: number | undefined | null)
  get clientId(): number
  get guid(): string
  get keys(): Array<string>
  getOrCreateArray(key: string): YArray
  getOrCreateText(key: string): YText
  getOrCreateMap(key: string): YMap
  createArray(): YArray
  createText(): YText
  createMap(): YMap
  applyUpdate(update: Uint8Array): void
  encodeStateAsUpdateV1(state?: Uint8Array | undefined | null): Uint8Array
  gc(): void
  onUpdate(callback: (result: Uint8Array) => void): void
}

export declare class YArray {
  constructor()
  get length(): number
  get isEmpty(): boolean
  get<T = unknown>(index: number): T
  insert(index: number, value: YArray | YMap | YText | boolean | number | string | Record<string, any> | null | undefined): void
  remove(index: number, len: number): void
  toJson(): JsArray
}

export declare class YMap {
  constructor()
  get length(): number
  get isEmpty(): boolean
  get<T = unknown>(key: string): T
  set(key: string, value: YArray | YMap | YText | boolean | number | string | Record<string, any> | null | undefined): void
  remove(key: string): void
  toJson(): object
}

export declare class YText {
  constructor()
  get len(): number
  get isEmpty(): boolean
  insert(index: number, str: string): void
  remove(index: number, len: number): void
  get length(): number
  toString(): string
}
