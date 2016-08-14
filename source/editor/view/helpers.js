import config from '../config.js'

export function createTree(id) {
  let element = document.createElement('div')
  element.setAttribute('id', id)
  element.classList.add(config.classTree)

  let layerBlocks = document.createElement('div')
  layerBlocks.classList.add(config.classLayer)
  layerBlocks.classList.add(config.classLayerBlocks)

  let layerConnections = document.createElement('div')
  layerConnections.classList.add(config.classLayer)
  layerConnections.classList.add(config.classLayerConnections)

  let layerComments = document.createElement('div')
  layerComments.classList.add(config.classLayer)
  layerComments.classList.add(config.classLayerComments)

  element.appendChild(layerComments)
  element.appendChild(layerConnections)
  element.appendChild(layerBlocks)

  return {
    dom: element,
    layers: {
      blocks      : layerBlocks,
      connections : layerConnections,
      comments    : layerComments,
    }
  }
}
export function createBlock(id, treeId, data) {
  let element = document.createElement('dom-block')
  element.setAttribute('id', id)
  element.update(data)
  return {
    dom  : element,
    tree : treeId,
  }
}
export function createConnection(id, treeId, data) {
  let element = document.createElement('dom-connection')
  element.setAttribute('id', id)
  element.update(data)
  return {
    dom  : element,
    tree : treeId,
  }
}

export function addElement(element, container) {
  container.appendChild(element)
}
export function removeElement(element, container) {
  container.removeChild(element)
}
export function getElement(id) {
  return document.getElementById(id)
}

export function addClass(element, class_) {
  element.classList.add(class_)
}
export function removeClass(element, class_) {
  element.classList.remove(class_)
}
