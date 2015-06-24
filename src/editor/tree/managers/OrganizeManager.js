b3e.tree.OrganizeManager = function(editor, project, tree) {
  "use strict";

  var lastLayout           = null;
  var depth                = 0;
  var leafCount            = 0;
  var horizontalSpacing    = 208;
  var verticalSpacing      = 88;
  var verticalCompensation = 42;
  var orderByIndex         = false;
  var connections          = []; // to redraw connections
  var blocks               = []; // to reposition blocks

  function stepH(block) {
    blocks.push(block);

    // leaf
    if (block._outConnections.length === 0) {
      leafCount++;

      // leaf nodes have the position accord. to the depth and leaf cont.
      var x = depth*horizontalSpacing;
      var y = leafCount*verticalSpacing;
    }

    // internal node
    else {
      // internal nodes have the position acord. to the depth and the
      //    mean position of its children
      var ySum = 0;

      if (orderByIndex) {
        var conns = block._outConnections;
      } else {
        // get connections ordered by y position
        var conns = block._outConnections.slice(0);
        conns.sort(function(a, b) {
          return a._outBlock.y - b._outBlock.y;
        })
      }

      for (var i=0; i<conns.length; i++) {
        depth++;
        connections.push(conns[i]);
        ySum += stepH(conns[i]._outBlock);
        depth--;
      }

      var x = depth*horizontalSpacing;
      var y = ySum/block._outConnections.length;
    }

    block.x = x;
    block.y = y;

    return y;
  }

  function stepV(block) {
    blocks.push(block);

    // leaf
    if (block._outConnections.length === 0) {
      leafCount++;

      // leaf nodes have the position accord. to the depth and leaf cont.
      var x = leafCount*horizontalSpacing;
      var y = depth*(verticalSpacing+verticalCompensation);
    }

    // internal node
    else {
      // internal nodes have the position acord. to the depth and the
      //    mean position of its children
      var xSum = 0;

      if (orderByIndex) {
        var conns = block._outConnections;
      } else {
        // get connections ordered by y position
        var conns = block._outConnections.slice(0);
        conns.sort(function(a, b) {
          return a._outBlock.x - b._outBlock.x;
        })
      }

      for (var i=0; i<conns.length; i++) {
        depth++;
        connections.push(conns[i]);
        xSum += stepV(conns[i]._outBlock);
        depth--;
      }

      var x = xSum/block._outConnections.length;
      var y = depth*(verticalSpacing+verticalCompensation);
    }

    block.x = x;
    block.y = y;

    return x;
  }

  this.organize = function(root, byIndex) {
    root = root || tree.blocks.getRoot();

    depth        = 0;
    leafCount     = 0;
    connections  = [];
    blocks       = [];
    orderByIndex = orderByIndex;

    var offsetX = root.x;
    var offsetY = root.y;

    var _olds = [];
    root.traversal(function(block) {
      _olds.push([block, block.x, block.y]);
    })

    var root = root;
    if (editor._settings.get('layout') === 'horizontal') {
      stepH(root);
    } else {
      stepV(root);
    }

    offsetX -= root.x;
    offsetY -= root.y;

    for (var i=0; i<blocks.length; i++) {
      blocks[i].x += offsetX;
      blocks[i].y += offsetY;
      blocks[i]._snap();
    }

    for (var i=0; i<connections.length; i++) {
      connections[i]._redraw();
    }

    var _news = [];
    root.traversal(function(block) {
      _news.push([block, block.x, block.y]);
    })

    project.history._beginBatch();
    for (var i=0; i<blocks.length; i++) {
      var _old = [tree.blocks, tree.blocks._move, _olds[i]];
      var _new = [tree.blocks, tree.blocks._move, _news[i]];
      project.history._add(new b3e.Command(_old, _new));
    }
    project.history._endBatch();
  }

  this._applySettings = function(settings) {
    var layout = settings.get('layout');
    if (lastLayout && layout !== lastLayout) {
      this.organize();
    }
    lastLayout = layout;
  }
}
