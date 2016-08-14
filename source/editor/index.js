import config from './config.js'
import Editor from './editor.js'
import logger from './common/logging.js'

// window.b3.editor = new Editor();

window.b3 = window.b3 || {}
window.b3.Editor = Editor
logger.setLevel(config.logLevel)










// TEST -----------------------------------------------------------------------
window.test = function() {
  test_controller_tree()
}
window.test()

import {createId} from './common/utils.js'
function test_controller_tree() {
  let editor = new Editor()
  editor.view.run('trees.add') // RANDOM
  editor.view.run('trees.add', {id: ''}) // RANDOM
}

function test_connection_commands() {
  const TREE_A = createId()
  const CONNECTION_A = createId()
  const CONNECTION_B = createId()
  const CONNECTION_C = createId()

  let editor = new Editor()
  editor.view.run('trees.add', {id: TREE_A})
  editor.view.run('trees.select', {id: TREE_A})
  editor.view.run('connections.add', {id: CONNECTION_A, treeId: TREE_A, data:{
    x1: 200, y1: 200, x2: 300, y2: 300,
  }})
  editor.view.run('connections.add', {id: CONNECTION_B, treeId: TREE_A, data:{
    x1: 200, y1: 400, x2: 300, y2: 400,
  }})
  editor.view.run('connections.add', {id: CONNECTION_C, treeId: TREE_A, data:{
    x1: 200, y1: 400, x2: 300, y2: 400,
  }})

  editor.view.run('connections.update', {id: CONNECTION_B, data:{
    x1: 200, y1: 400, x2: 400, y2: 400,
  }})

  editor.view.run('connections.remove', {id: CONNECTION_C})
}
function test_blocks_commands() {
  const TREE_A = createId()
  const BLOCK_A = createId()
  const BLOCK_B = createId()
  const BLOCK_C = createId()
  const BLOCK_D = createId()

  let editor = new Editor()
  editor.view.run('trees.add', {id: TREE_A})
  editor.view.run('trees.select', {id: TREE_A})
  editor.view.run('blocks.add', {id: BLOCK_A, treeId: TREE_A, data:{
    title : 'Block A',
    name  : 'yea',
    x     : 200,
    y     : 300
  }})
  editor.view.run('blocks.add', {id: BLOCK_B, treeId: TREE_A, data:{
    title : 'Block B',
    name  : 'nothing',
    x     : 200,
    y     : 100
  }})
  editor.view.run('blocks.add', {id: BLOCK_C, treeId: TREE_A, data:{
    title : 'Block C',
    name  : 'meh',
    x     : 200,
    y     : 500
  }})
  editor.view.run('blocks.add', {id: BLOCK_D, treeId: TREE_A, data:{
    title : 'Block D',
    name  : 'heheheh'
  }})

  // test move
  editor.view.run('blocks.move', {id: BLOCK_C, x: 200, y: 600})

  // test update
  editor.view.run('blocks.update', {id: BLOCK_B, data: {
    title : 'New Title B',
    name  : 'New name',
    x     : 150
  }})

  // test select
  editor.view.run('blocks.select', {id: BLOCK_A})
  editor.view.run('blocks.select', {id: BLOCK_C})

  // test deselect
  editor.view.run('blocks.deselect', {id: BLOCK_C})

  // test remove
  editor.view.run('blocks.remove', {id: BLOCK_D})
}
function test_tree_commands() {
  const TREE_A = createId()
  const TREE_B = createId()
  const TREE_C = createId()

  let editor = new Editor()
  editor.view.run('trees.add', {id: TREE_A})
  editor.view.run('trees.add', {id: TREE_B})
  editor.view.run('trees.add', {id: TREE_C})
  editor.view.run('trees.select', {id: TREE_A})
  editor.view.run('trees.select', {id: TREE_C})
  editor.view.run('trees.select', {id: TREE_A})
  editor.view.run('trees.remove', {id: TREE_B})
}


import * as helpers from './view/helpers.js'
function test_helpers() {
  let editor = new Editor()
  console.log(editor)

  let canvas = helpers.getElement('canvas')
  console.log(canvas)

  let tree_a = helpers.createTree('tree_a')
  let tree_b = helpers.createTree('tree_b')
  console.log(tree_a, tree_b)
  helpers.addElement(tree_a.dom, canvas)
  helpers.addElement(tree_b.dom, canvas)

  let block_a_1 = helpers.createBlock('block_a_1', {title: '=D', name:'meh'})
  console.log(block_a_1)
  helpers.addElement(block_a_1.dom, tree_a.layers.blocks)

  let connection_a_1 = helpers.createConnection('connection_a_1', {})
  console.log(connection_a_1)
  helpers.addElement(connection_a_1.dom, tree_a.layers.connections)

  helpers.addClass(tree_a.dom, 'foo')
  helpers.addClass(tree_a.dom, 'bar')
  helpers.removeClass(tree_a.dom, 'foo')
}
