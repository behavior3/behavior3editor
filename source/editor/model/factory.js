export default class factory {
  static makeProject() {
    return {
      id        : null,
      path      : null,
      name      : null,
      version   : null,
      createdAt : null,
      updatedAt : null,
    }
  }

  static makeTree() {
    return {
      id          : null,
      name        : null,
      root        : null,
      nodes       : [],
      connections : null,
    }
  }

  static makeNode() {
    return {
      id          : null,
      name        : null,
      group       : null,
      category    : null,
      title       : null,
      description : null,
      properties  : null,
    }
  }

  static makeBlock() {
    return {
      id             : null,
      tree           : null,
      name           : null,
      category       : null,
      title          : null,
      description    : null,
      properties     : null,
      x              : null,
      y              : null,
      inConnections  : [],
      outConnections : [],
      children       : [],
    }
  }

  static makeConnection() {
    return {
      id       : null,
      tree     : null,
      inBlock  : null,
      outBlock : null,
    }
  }
}
