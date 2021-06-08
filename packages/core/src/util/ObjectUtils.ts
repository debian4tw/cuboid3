
export class ObjectUtils {

  public static extend(from: any, to: any) {
    if (from == null || typeof from != "object") return from;
    if (from.constructor != Object && from.constructor != Array) return from;
    if (from.constructor == Date || from.constructor == RegExp || from.constructor == Function ||
        from.constructor == String || from.constructor == Number || from.constructor == Boolean)
        return new from.constructor(from);

    to = to || new from.constructor();

    for (var name in from) {
        to[name] = typeof to[name] == "undefined" ? this.extend(from[name], null) : to[name];
    }
    return to;
  }
}