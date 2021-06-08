export class NetworkUtils {

  public static encodeString(c: any) {
    let x='charCodeAt',b,e:any={},f=c.split(""),d=[],a=f[0],g=256;
    for(b=1;b<f.length;b++)c=f[b],null!=e[a+c]?a+=c:(d.push(1<a.length?e[a]:a[x](0)),e[a+c]=g,g++,a=c);d.push(1<a.length?e[a]:a[x](0));for(b=0;b<d.length;b++)d[b]=String.fromCharCode(d[b]);return d.join("")
  }

  public static decodeString(b: any) {
    let f: any
    let o: any
    var a,e:any={},d=b.split(""),c:any=f=d[0],g=[c],h=o=256;
    for(b=1;b<d.length;b++)a=d[b].charCodeAt(0),a=h>a?d[b]:e[a]?e[a]:f+c,g.push(a),c=a.charAt(0),e[o]=f+c,o++,f=a;return g.join("")
  }

  public static diffState(prevState: any, newState: any) {
    let diff: any = {}
    Object.keys(newState).forEach((key: any) => {
      if (newState[key] !== prevState[key]) {
        diff[key] = newState[key]
      }
    })

    return diff
  }

}