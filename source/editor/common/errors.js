export default class EditorError {
  constructor(code, data) {
    this.code = code
    this.data = data
  }

  toString() {
    let base = `Error "${this.code}"`

    if (this.data) {
      let data = JSON.stringify(this.data)
      base = base+`: ${data}`
    }

    return base
  }
}
