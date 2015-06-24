/**
 * b3
 * 
 * Copyright (c) 2014 Renato de Pontes Pereira.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to 
 * deal in the Software without restriction, including without limitation the 
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
**/

this.b3 = this.b3 || {};

/**
 * Behavior3JS
 * ===========
 *
 * * * *
 * 
 * **Behavior3JS** is a Behavior Tree library written in JavaScript. It 
 * provides structures and algorithms that assist you in the task of creating 
 * intelligent agents for your game or application. Check it out some features 
 * of Behavior3JS:
 * 
 * - Based on the work of (Marzinotto et al., 2014), in which they propose a 
 *   **formal**, **consistent** and **general** definition of Behavior Trees;
 * - **Optimized to control multiple agents**: you can use a single behavior 
 *   tree instance to handle hundreds of agents;
 * - It was **designed to load and save trees in a JSON format**, in order to 
 *   use, edit and test it in multiple environments, tools and languages;
 * - A **cool visual editor** which you can access online;
 * - Several **composite, decorator and action nodes** available within the 
 *   library. You still can define your own nodes, including composites and 
 *   decorators;
 * - **Completely free**, the core module and the visual editor are all published
 *   under the MIT License, which means that you can use them for your open source
 *   and commercial projects;
 * - **Lightweight**, only 11.5KB!
 * 
 * Visit http://behavior3js.guineashots.com to know more!
 *
 * 
 * Core Classes and Functions
 * --------------------------
 * 
 * This library include the following core structures...
 *
 * **Public:**
 * 
 * - **BehaviorTree**: the structure that represents a Behavior Tree;
 * - **Blackboard**: represents a "memory" in an agent and is required to to 
 *   run a `BehaviorTree`;
 * - **Composite**: base class for all composite nodes;
 * - **Decorator**: base class for all decorator nodes;
 * - **Action**: base class for all action nodes;
 * - **Condition**: base class for all condition nodes;
 *
 * **Internal:**
 * 
 * 
 * - **Tick**: used as container and tracking object through the tree during 
 *   the tick signal;
 * - **BaseNode**: the base class that provide all common node features;
 * 
 * *Some classes are used internally on Behavior3JS, but you may need to access
 * its functionalities eventually, specially the `Tick` object.*
 *
 * 
 * Nodes Included 
 * --------------
 *
 * **Composite Nodes**: 
 * 
 * - Sequence;
 * - Priority;
 * - MemSequence;
 * - MemPriority;
 * 
 * 
 * **Decorators**: 
 * 
 * - Inverter;
 * - Limiter
 * - MaxTime;
 * - Repeater;
 * - RepeaterUntilFailure;
 * - RepeaterUntilSuccess;
 *
 * 
 * **Actions**:
 * 
 * - Succeeder;
 * - Failer;
 * - Error;
 * - Runner;
 * - Wait.
 * 
 * @module Behavior3JS
 * @main Behavior3JS
**/

(function() {
"use strict";

/**
 * List of all constants in Behavior3JS.
 *
 * @class Constants
**/

/**
 * Version of the library.
 * 
 * @property VERSION
 * @type {String}
 */
b3.VERSION   = '0.1.0';

/**
 * Returned when a criterion has been met by a condition node or an action node
 * has been completed successfully.
 * 
 * @property SUCCESS
 * @type {Integer}
 */
b3.SUCCESS   = 1;

/**
 * Returned when a criterion has not been met by a condition node or an action 
 * node could not finish its execution for any reason.
 * 
 * @property FAILURE
 * @type {Integer}
 */
b3.FAILURE   = 2;

/**
 * Returned when an action node has been initialized but is still waiting the 
 * its resolution.
 * 
 * @property FAILURE
 * @type {Integer}
 */
b3.RUNNING   = 3;

/**
 * Returned when some unexpected error happened in the tree, probably by a 
 * programming error (trying to verify an undefined variable). Its use depends 
 * on the final implementation of the leaf nodes.
 * 
 * @property ERROR
 * @type {Integer}
 */
b3.ERROR     = 4;


/**
 * Describes the node category as Composite.
 * 
 * @property COMPOSITE
 * @type {String}
 */
b3.COMPOSITE = 'composite';

/**
 * Describes the node category as Decorator.
 * 
 * @property DECORATOR
 * @type {String}
 */
b3.DECORATOR = 'decorator';

/**
 * Describes the node category as Action.
 * 
 * @property ACTION
 * @type {String}
 */
b3.ACTION    = 'action';

/**
 * Describes the node category as Condition.
 * 
 * @property CONDITION
 * @type {String}
 */
b3.CONDITION = 'condition';


/**
 * List of internal and helper functions in Behavior3JS.
 * 
 * @class Utils
**/


/**
 * This function is used to create unique IDs for trees and nodes.
 * 
 * (consult http://www.ietf.org/rfc/rfc4122.txt).
 *
 * @method createUUID
 * @return {String} A unique ID.
**/
b3.createUUID = function() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    // bits 12-15 of the time_hi_and_version field to 0010
    s[14] = "4";

    // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);

    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

/**
 * Class is a meta-factory function to create classes in JavaScript. It is a
 * shortcut for the CreateJS syntax style. By default, the class created by 
 * this function have an initialize function (the constructor). Optionally, you
 * can specify the inheritance by passing another class as parameter.
 *
 * By default, all classes created using this function, may receives only a
 * settings parameter as argument. This pattern is commonly used by jQuery and 
 * its plugins.
 *
 * Usage
 * -----
 *
 *     // Creating a simple class
 *     var BaseClass = b3.Class();
 *
 *     // Using inheritance
 *     var ChildClass = b3.Class(BaseClass);
 *
 *     // Defining the constructor
 *     ChildClass.prototype.initialize = function(settings) { ... }
 *
 * @method Class
 * @param {Object} [baseClass] The super class.
 * @return {Object} A new class.
**/
b3.Class = function(baseClass) {
    // create a new class
    var cls = function(params) {
        this.initialize(params);
    };
    
    // if base class is provided, inherit
    if (baseClass) {
        cls.prototype = Object.create(baseClass.prototype);
        cls.prototype.constructor = cls;
    }
    
    // create initialize if does not exist on baseClass
    if(!cls.prototype.initialize) {
        cls.prototype.initialize = function() {};
    }

    return cls;
}

})();/**
 * Blackboard
 *
 * Copyright (c) 2014 Renato de Pontes Pereira.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to 
 * deal in the Software without restriction, including without limitation the 
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
**/

/**
 * @module Behavior3JS
 **/

// namespace:
this.b3 = this.b3 || {};

(function() {
"use strict";

/**
 * The Blackboard is the memory structure required by `BehaviorTree` and its 
 * nodes. It only have 2 public methods: `set` and `get`. These methods works 
 * in 3 different contexts: global, per tree, and per node per tree.
 * 
 * Suppose you have two different trees controlling a single object with a 
 * single blackboard, then:
 *
 * - In the global context, all nodes will access the stored information. 
 * - In per tree context, only nodes sharing the same tree share the stored 
 *   information.
 * - In per node per tree context, the information stored in the blackboard can
 *   only be accessed by the same node that wrote the data.
 *   
 * The context is selected indirectly by the parameters provided to these 
 * methods, for example:
 * 
 *     // getting/setting variable in global context
 *     blackboard.set('testKey', 'value');
 *     var value = blackboard.get('testKey');
 *     
 *     // getting/setting variable in per tree context
 *     blackboard.set('testKey', 'value', tree.id);
 *     var value = blackboard.get('testKey', tree.id);
 *     
 *     // getting/setting variable in per node per tree context
 *     blackboard.set('testKey', 'value', tree.id, node.id);
 *     var value = blackboard.get('testKey', tree.id, node.id);
 * 
 * Note: Internally, the blackboard store these memories in different objects,
 *  being the global on `_baseMemory`, the per tree on `_treeMemory` and the 
 *  per node per tree dynamically create inside the per tree memory (it is 
 *  accessed via `_treeMemory[id].nodeMemory`). Avoid to use these variables 
 *  manually, use `get` and `set` instead.
 *  
 * @class Blackboard
**/
var Blackboard = b3.Class();

var p = Blackboard.prototype;

    /**
     * Initialization method.
     *
     * @method initialize
     * @constructor
    **/
    p.initialize = function() {
        this._baseMemory = {};
        this._treeMemory = {};
    }

    /**
     * Internal method to retrieve the tree context memory. If the memory does
     * not exist, this method creates it.
     *
     * @method _getTreeMemory
     * @param {string} treeScope The id of the tree in scope.
     * @returns {Object} The tree memory.
     * @protected
    **/
    p._getTreeMemory = function(treeScope) {
        if (!this._treeMemory[treeScope]) {
            this._treeMemory[treeScope] = {
                'nodeMemory'         : {},
                'openNodes'          : [],
                'traversalDepth'     : 0,
                'traversalCycle'     : 0,
            };
        }
        return this._treeMemory[treeScope];
    };

    /**
     * Internal method to retrieve the node context memory, given the tree 
     * memory. If the memory does not exist, this method creates is.
     *
     * @method _getNodeMemory
     * @param {String} treeMemory the tree memory.
     * @param {String} nodeScope The id of the node in scope.
     * @returns {Object} The node memory.
     * @protected
    **/
    p._getNodeMemory = function(treeMemory, nodeScope) {
        var memory = treeMemory['nodeMemory'];
        if (!memory[nodeScope]) {
            memory[nodeScope] = {};
        }

        return memory[nodeScope];
    };

    /**
     * Internal method to retrieve the context memory. If treeScope and 
     * nodeScope are provided, this method returns the per node per tree 
     * memory. If only the treeScope is provided, it returns the per tree 
     * memory. If no parameter is provided, it returns the global memory. 
     * Notice that, if only nodeScope is provided, this method will still 
     * return the global memory.
     *
     * @method _getMemory
     * @param {String} treeScope The id of the tree scope.
     * @param {String} nodeScope The id of the node scope.
     * @returns {Object} A memory object.
     * @protected
    **/
    p._getMemory = function(treeScope, nodeScope) {
        var memory = this._baseMemory;

        if (treeScope) {
            memory = this._getTreeMemory(treeScope);

            if (nodeScope) {
                memory = this._getNodeMemory(memory, nodeScope);
            }
        }

        return memory;
    };

    /**
     * Stores a value in the blackboard. If treeScope and nodeScope are 
     * provided, this method will save the value into the per node per tree 
     * memory. If only the treeScope is provided, it will save the value into 
     * the per tree memory. If no parameter is provided, this method will save 
     * the value into the global memory. Notice that, if only nodeScope is 
     * provided (but treeScope not), this method will still save the value into
     * the global memory.
     *
     * @method set
     * @param {String} key The key to be stored.
     * @param {String} value The value to be stored.
     * @param {String} treeScope The tree id if accessing the tree or node 
     *                           memory.
     * @param {String} nodeScope The node id if accessing the node memory.
    **/
    p.set = function(key, value, treeScope, nodeScope) {
        var memory = this._getMemory(treeScope, nodeScope);
        memory[key] = value;
    };

    /**
     * Retrieves a value in the blackboard. If treeScope and nodeScope are
     * provided, this method will retrieve the value from the per node per tree
     * memory. If only the treeScope is provided, it will retrieve the value
     * from the per tree memory. If no parameter is provided, this method will
     * retrieve from the global memory. If only nodeScope is provided (but
     * treeScope not), this method will still try to retrieve from the global
     * memory.
     *
     * @method get
     * @param {String} key The key to be retrieved.
     * @param {String} treeScope The tree id if accessing the tree or node 
     *                           memory.
     * @param {String} nodeScope The node id if accessing the node memory.
     * @returns {Object} The value stored or undefined.
    **/
    p.get = function(key, treeScope, nodeScope) {
        var memory = this._getMemory(treeScope, nodeScope);
        return memory[key];
    };
    
b3.Blackboard = Blackboard;

})();/**
 * Tick
 *
 * Copyright (c) 2014 Renato de Pontes Pereira.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to 
 * deal in the Software without restriction, including without limitation the 
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
**/

/**
 * @module Behavior3JS
 **/

// namespace:
this.b3 = this.b3 || {};

(function() {
"use strict";

/**
 * A new Tick object is instantiated every tick by BehaviorTree. It is passed 
 * as parameter to the nodes through the tree during the traversal.
 * 
 * The role of the Tick class is to store the instances of tree, debug, target
 * and blackboard. So, all nodes can access these informations.
 * 
 * For internal uses, the Tick also is useful to store the open node after the 
 * tick signal, in order to let `BehaviorTree` to keep track and close them 
 * when necessary.
 *
 * This class also makes a bridge between nodes and the debug, passing the node
 * state to the debug if the last is provided.
 *
 * @class Tick
**/
var Tick = b3.Class();

var p = Tick.prototype;

    /**
     * The tree reference.
     * 
     * @property tree
     * @type {b3.BehaviorTree}
     * @readOnly
     */
    
    /**
     * The debug reference.
     * 
     * @property debug
     * @type {Object}
     * @readOnly
     */
    
    /**
     * The target object reference.
     * 
     * @property target
     * @type {Object}
     * @readOnly
     */
    
    /**
     * The blackboard reference.
     * 
     * @property blackboard
     * @type {Blackboard}
     * @readOnly
     */
    
    /**
     * The list of open nodes. Update during the tree traversal.
     * 
     * @property _openNodes
     * @type {Array}
     * @protected
     * @readOnly
     */
    
    /**
     * The number of nodes entered during the tick. Update during the tree 
     * traversal.
     * 
     * @property _nodeCount
     * @type {Integer}
     * @protected
     * @readOnly
     */
    
    /**
     * Initialization method.
     *
     * @method initialize
     * @constructor
    **/
    p.initialize = function() {
        // set by BehaviorTree
        this.tree       = null;
        this.debug      = null;
        this.target     = null;
        this.blackboard = null;

        // updated during the tick signal
        this._openNodes  = [];
        this._nodeCount  = 0;
    }

    /**
     * Called when entering a node (called by BaseNode).
     *
     * @method _enterNode
     * @param {Object} node The node that called this method.
     * @protected
    **/
    p._enterNode = function(node) {
        this._nodeCount++;
        this._openNodes.push(node);

        // TODO: call debug here
    }

    /**
     * Callback when opening a node (called by BaseNode). 
     *
     * @method _openNode
     * @param {Object} node The node that called this method.
     * @protected
    **/
    p._openNode = function(node) {
        // TODO: call debug here
    }

    /**
     * Callback when ticking a node (called by BaseNode).
     *
     * @method _tickNode
     * @param {Object} node The node that called this method.
     * @protected
    **/
    p._tickNode = function(node) {
        // TODO: call debug here
    }

    /**
     * Callback when closing a node (called by BaseNode).
     *
     * @method _closeNode
     * @param {Object} node The node that called this method.
     * @protected
    **/
    p._closeNode = function(node) {
        // TODO: call debug here
        this._openNodes.pop();
    }

    /**
     * Callback when exiting a node (called by BaseNode).
     *
     * @method _exitNode
     * @param {Object} node The node that called this method.
     * @protected
    **/
    p._exitNode = function(node) {
        // TODO: call debug here
    }

b3.Tick = Tick;

})();/**
 * BehaviorTree
 *
 * Copyright (c) 2014 Renato de Pontes Pereira.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to 
 * deal in the Software without restriction, including without limitation the 
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
**/

/**
 * @module Behavior3JS
 **/

// namespace:
this.b3 = this.b3 || {};

(function() {
"use strict";

/**
 * The BehaviorTree class, as the name implies, represents the Behavior Tree 
 * structure.
 * 
 * There are two ways to construct a Behavior Tree: by manually setting the 
 * root node, or by loading it from a data structure (which can be loaded from 
 * a JSON). Both methods are shown in the examples below and better explained 
 * in the user guide.
 *
 * The tick method must be called periodically, in order to send the tick 
 * signal to all nodes in the tree, starting from the root. The method 
 * `BehaviorTree.tick` receives a target object and a blackboard as parameters.
 * The target object can be anything: a game agent, a system, a DOM object, 
 * etc. This target is not used by any piece of Behavior3JS, i.e., the target
 * object will only be used by custom nodes.
 * 
 * The blackboard is obligatory and must be an instance of `Blackboard`. This 
 * requirement is necessary due to the fact that neither `BehaviorTree` or any 
 * node will store the execution variables in its own object (e.g., the BT does
 * not store the target, information about opened nodes or number of times the 
 * tree was called). But because of this, you only need a single tree instance 
 * to control multiple (maybe hundreds) objects.
 * 
 * Manual construction of a Behavior Tree
 * --------------------------------------
 * 
 *     var tree = new b3.BehaviorTree();
 *  
 *     tree.root = new b3.Sequence({children:[
 *         new b3.Priority({children:[
 *             new MyCustomNode(),
 *             new MyCustomNode()
 *         ]}),
 *         ...
 *     ]});
 *     
 * 
 * Loading a Behavior Tree from data structure
 * -------------------------------------------
 * 
 *     var tree = new b3.BehaviorTree();
 *
 *     tree.load({
 *         'title'       : 'Behavior Tree title'
 *         'description' : 'My description'
 *         'root'        : 'node-id-1'
 *         'nodes'       : {
 *             'node-id-1' : {
 *                 'name'        : 'Priority', // this is the node type
 *                 'title'       : 'Root Node', 
 *                 'description' : 'Description', 
 *                 'children'    : ['node-id-2', 'node-id-3'], 
 *             },
 *             ...
 *         }
 *     })
 *     
 *
 * @class BehaviorTree
**/
var BehaviorTree = b3.Class();

var p = BehaviorTree.prototype;

    /**
     * The tree id, must be unique. By default, created with `b3.createUUID`.
     * 
     * @property id
     * @type {String}
     * @readOnly
     */
    
    /**
     * The tree title.
     *
     * @property title
     * @type {String}
     */
    
    /**
     * Description of the tree.
     *
     * @property description
     * @type {String}
     */
    
    /**
     * A dictionary with (key-value) properties. Useful to define custom 
     * variables in the visual editor.
     *
     * @property properties
     * @type {Object}
     */

    /**
     * The reference to the root node. Must be an instance of `b3.BaseNode`.
     *
     * @property root
     * @type {BaseNode}
     */

    /**
     * The reference to the debug instance.
     *
     * @property debug
     * @type {Object}
     */

    /**
     * Initialization method.
     *
     * @method initialize
     * @constructor
    **/
    p.initialize = function() {
        this.id          = b3.createUUID();
        this.title       = 'The behavior tree';
        this.description = 'Default description';
        this.properties  = {};
        this.root        = null;
        this.debug       = null;
    }

    /**
     * This method loads a Behavior Tree from a data structure, populating this
     * object with the provided data. Notice that, the data structure must 
     * follow the format specified by Behavior3JS. Consult the guide to know 
     * more about this format.
     *
     * You probably want to use custom nodes in your BTs, thus, you need to 
     * provide the `names` object, in which this method can find the nodes by 
     * `names[NODE_NAME]`. This variable can be a namespace or a dictionary, 
     * as long as this method can find the node by its name, for example:
     *
     *     //json
     *     ...
     *     'node1': {
     *       'name': MyCustomNode,
     *       'title': ...
     *     }
     *     ...
     *     
     *     //code
     *     var bt = new b3.BehaviorTree();
     *     bt.load(data, {'MyCustomNode':MyCustomNode})
     *     
     * 
     * @method load
     * @param {Object} data The data structure representing a Behavior Tree.
     * @param {Object} [names] A namespace or dict containing custom nodes.
    **/
    p.load = function(data, names) {
        names = names || {};

        this.title       = data.title || this.title;
        this.description = data.description || this.description;
        this.properties  = data.properties || this.properties;

        var nodes = {};
        // Create the node list (without connection between them)
        for (var id in data.nodes) {
            var spec = data.nodes[id];

            if (spec.name in names) {
                // Look for the name in custom nodes
                var cls = names[spec.name];
            } else if (spec.name in b3) {
                // Look for the name in default nodes
                var cls = b3[spec.name];
            } else {
                // Invalid node name
                throw EvalError('BehaviorTree.load: Invalid node name + "'+
                                 spec.name+'".');
            }

            var node = new cls(spec.properties);
            node.id = spec.id || node.id;
            node.title = spec.title || node.title;
            node.description = spec.description || node.description;
            node.properties = spec.properties || node.properties;

            nodes[id] = node;
        }

        // Connect the nodes
        for (var id in data.nodes) {
            var spec = data.nodes[id];
            var node = nodes[id];

            if (node.category === b3.COMPOSITE && spec.children) {
                for (var i=0; i<spec.children.length; i++) {
                    var cid = spec.children[i];
                    node.children.push(nodes[cid]);
                }
            } else if (node.category === b3.DECORATOR && spec.child) {
                node.child = nodes[spec.child];
            }
        }

        this.root = nodes[data.root];
    };

    /**
     * This method dump the current BT into a data structure.
     *
     * Note: This method does not record the current node parameters. Thus, 
     * it may not be compatible with load for now.
     * 
     * @method dump
     * @returns {Object} A data object representing this tree.
    **/
    p.dump = function() {
        var data = {};
        var customNames = [];

        data.title        = this.title;
        data.description  = this.description;
        data.root         = (this.root)? this.root.id:null;
        data.properties   = this.properties;
        data.nodes        = {};
        data.custom_nodes = [];

        if (!this.root) return data;

        var stack = [this.root];
        while (stack.length > 0) {
            var node = stack.pop();

            var spec = {};
            spec.id = node.id;
            spec.name = node.name;
            spec.title = node.title;
            spec.description = node.description;
            spec.properties = node.properties;
            spec.parameters = node.parameters;

            // verify custom node
            var nodeName = node.__proto__.name || node.name;
            if (!b3[nodeName] && customNames.indexOf(nodeName) < 0) {
                var subdata = {}
                subdata.name = nodeName;
                subdata.title = node.__proto__.title || node.title;
                subdata.category = node.category;

                customNames.push(nodeName);
                data.custom_nodes.push(subdata);
            }
            
            // store children/child
            if (node.category === b3.COMPOSITE && node.children) {
                var children = []
                for (var i=node.children.length-1; i>=0; i--) {
                    children.push(node.children[i].id);
                    stack.push(node.children[i]);
                }
                spec.children = children;
            } else if (node.category === b3.DECORATOR && node.child) {
                stack.push(node.child);
                spec.child = node.child.id;
            }

            data.nodes[node.id] = spec;
        }

        return data;
    };

    /**
     * Propagates the tick signal through the tree, starting from the root.
     * 
     * This method receives a target object of any type (Object, Array, 
     * DOMElement, whatever) and a `Blackboard` instance. The target object has
     * no use at all for all Behavior3JS components, but surely is important 
     * for custom nodes. The blackboard instance is used by the tree and nodes 
     * to store execution variables (e.g., last node running) and is obligatory
     * to be a `Blackboard` instance (or an object with the same interface).
     * 
     * Internally, this method creates a Tick object, which will store the 
     * target and the blackboard objects.
     * 
     * Note: BehaviorTree stores a list of open nodes from last tick, if these 
     * nodes weren't called after the current tick, this method will close them 
     * automatically.
     * 
     * @method tick
     * @param {Object} target A target object.
     * @param {Blackboard} blackboard An instance of blackboard object.
     * @returns {Constant} The tick signal state.
    **/
    p.tick = function(target, blackboard) {
        if (!blackboard) {
            throw 'The blackboard parameter is obligatory and must be an ' +
                  'instance of b3.Blackboard';
        }

        /* CREATE A TICK OBJECT */
        var tick = new b3.Tick();
        tick.debug      = this.debug;
        tick.target     = target;
        tick.blackboard = blackboard;
        tick.tree       = this;

        /* TICK NODE */
        var state = this.root._execute(tick);

        /* CLOSE NODES FROM LAST TICK, IF NEEDED */
        var lastOpenNodes = blackboard.get('openNodes', this.id);
        var currOpenNodes = tick._openNodes.slice(0);

        // does not close if it is still open in this tick
        var start = 0;
        for (var i=0; i<Math.min(lastOpenNodes.length, currOpenNodes.length); i++) {
            start = i+1;
            if (lastOpenNodes[i] !== currOpenNodes[i]) {
                break;
            } 
        }

        // close the nodes
        for (var i=lastOpenNodes.length-1; i>=start; i--) {
            lastOpenNodes[i]._close(tick);
        }

        /* POPULATE BLACKBOARD */
        blackboard.set('openNodes', currOpenNodes, this.id);
        blackboard.set('nodeCount', tick._nodeCount, this.id);

        return state;
    };
   

b3.BehaviorTree = BehaviorTree;

})();/**
 * BaseNode
 *
 * Copyright (c) 2014 Renato de Pontes Pereira.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to 
 * deal in the Software without restriction, including without limitation the 
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
**/

/**
 * @module Behavior3JS
 **/

// namespace:
this.b3 = this.b3 || {};

(function() {
"use strict";

/**
 * The BaseNode class is used as super class to all nodes in BehaviorJS. It 
 * comprises all common variables and methods that a node must have to execute.
 *
 * **IMPORTANT:** Do not inherit from this class, use `b3.Composite`, 
 * `b3.Decorator`, `b3.Action` or `b3.Condition`, instead.
 *
 * The attributes are specially designed to serialization of the node in a JSON
 * format. In special, the `parameters` attribute can be set into the visual 
 * editor (thus, in the JSON file), and it will be used as parameter on the 
 * node initialization at `BehaviorTree.load`.
 * 
 * BaseNode also provide 5 callback methods, which the node implementations can
 * override. They are `enter`, `open`, `tick`, `close` and `exit`. See their 
 * documentation to know more. These callbacks are called inside the `_execute`
 * method, which is called in the tree traversal.
 * 
 * @class BaseNode
**/
var BaseNode = b3.Class();

var p = BaseNode.prototype;

    /**
     * Node ID.
     *
     * @property id
     * @type {String}
     * @readonly
    **/

    /**
     * Node name. Must be a unique identifier, preferable the same name of the 
     * class. You have to set the node name in the prototype.
     *
     * @property name
     * @type {String}
     * @readonly
    **/
    p.name = null;

    /**
     * Node category. Must be `b3.COMPOSITE`, `b3.DECORATOR`, `b3.ACTION` or 
     * `b3.CONDITION`. This is defined automatically be inheriting the 
     * correspondent class.
     *
     * @property category
     * @type constant
     * @readonly
    **/
    p.category = null;

    /**
     * Node title.
     *
     * @property title
     * @type {String}
     * @optional
     * @readonly
    **/
    p.title = null;

    /**
     * Node description.
     *
     * @property description
     * @type {String}
     * @optional
     * @readonly
    **/
    p.description = null;

    /**
     * A dictionary (key, value) describing the node parameters. Useful for 
     * defining parameter values in the visual editor. Note: this is only 
     * useful for nodes when loading trees from JSON files.
     *
     * @property parameters
     * @type {Object}
     * @readonly
    **/
    p.parameters = null;

    /**
     * A dictionary (key, value) describing the node properties. Useful for 
     * defining custom variables inside the visual editor.
     *
     * @property properties
     * @type {Object}
     * @readonly
    **/
    p.properties = null;

    /**
     * Initialization method.
     *
     * @method initialize
     * @constructor
    **/
    p.initialize = function() {
        this.id          = b3.createUUID();
        this.title       = this.title || this.name;
        this.description = '';
        this.parameters  = {};
        this.properties  = {};
    }

    /**
     * This is the main method to propagate the tick signal to this node. This 
     * method calls all callbacks: `enter`, `open`, `tick`, `close`, and 
     * `exit`. It only opens a node if it is not already open. In the same 
     * way, this method only close a node if the node  returned a status 
     * different of `b3.RUNNING`.
     *
     * @method _execute
     * @param {Tick} tick A tick instance.
     * @returns {Constant} The tick state.
     * @protected
    **/
    p._execute = function(tick) {
        /* ENTER */
        this._enter(tick);

        /* OPEN */
        if (!tick.blackboard.get('isOpen', tick.tree.id, this.id)) {
            this._open(tick);
        }

        /* TICK */
        var status = this._tick(tick);

        /* CLOSE */
        if (status !== b3.RUNNING) {
            this._close(tick);
        }

        /* EXIT */
        this._exit(tick);

        return status;
    }

    /**
     * Wrapper for enter method.
     *
     * @method _enter
     * @param {Tick} tick A tick instance.
     * @protected
    **/
    p._enter = function(tick) {
        tick._enterNode(this);
        this.enter(tick);
    }

    /**
     * Wrapper for open method.
     *
     * @method _open
     * @param {Tick} tick A tick instance.
     * @protected
    **/
    p._open  = function(tick) {
        tick._openNode(this);
        tick.blackboard.set('isOpen', true, tick.tree.id, this.id);
        this.open(tick);
    }

    /**
     * Wrapper for tick method.
     *
     * @method _tick
     * @param {Tick} tick A tick instance.
     * @returns {Constant} A state constant.
     * @protected
    **/
    p._tick  = function(tick) {
        tick._tickNode(this);
        return this.tick(tick);
    }

    /**
     * Wrapper for close method.
     *
     * @method _close
     * @param {Tick} tick A tick instance.
     * @protected
    **/
    p._close = function(tick) {
        tick._closeNode(this);
        tick.blackboard.set('isOpen', false, tick.tree.id, this.id);
        this.close(tick);
    }

    /**
     * Wrapper for exit method.
     *
     * @method _exit
     * @param {Tick} tick A tick instance.
     * @protected
    **/
    p._exit  = function(tick) {
        tick._exitNode(this);
        this.exit(tick);
    }

    /**
     * Enter method, override this to use. It is called every time a node is 
     * asked to execute, before the tick itself.
     *
     * @method enter
     * @param {Tick} tick A tick instance.
    **/
    p.enter = function(tick) {}

    /**
     * Open method, override this to use. It is called only before the tick 
     * callback and only if the not isn't closed.
     *
     * Note: a node will be closed if it returned `b3.RUNNING` in the tick.
     *
     * @method open
     * @param {Tick} tick A tick instance.
    **/
    p.open  = function(tick) {}

    /**
     * Tick method, override this to use. This method must contain the real 
     * execution of node (perform a task, call children, etc.). It is called
     * every time a node is asked to execute.
     *
     * @method tick
     * @param {Tick} tick A tick instance.
    **/
    p.tick  = function(tick) {}

    /**
     * Close method, override this to use. This method is called after the tick
     * callback, and only if the tick return a state different from 
     * `b3.RUNNING`.
     *
     * @method close
     * @param {Tick} tick A tick instance.
    **/
    p.close = function(tick) {}

    /**
     * Exit method, override this to use. Called every time in the end of the 
     * execution.
     *
     * @method exit
     * @param {Tick} tick A tick instance.
    **/
    p.exit  = function(tick) {}
    
b3.BaseNode = BaseNode;

})();/**
 * Action
 *
 * Copyright (c) 2014 Renato de Pontes Pereira.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to 
 * deal in the Software without restriction, including without limitation the 
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
**/

/**
 * @module Behavior3JS
 **/

// namespace:
this.b3 = this.b3 || {};

(function() {
"use strict";

/**
 * Action is the base class for all action nodes. Thus, if you want to 
 * create new custom action nodes, you need to inherit from this class. 
 *
 * For example, take a look at the Runner action:
 * 
 *     var Runner = b3.Class(b3.Action);
 *     var p = Runner.prototype;
 *     
 *         p.name = 'Runner';
 *     
 *         p.tick = function(tick) {
 *             return b3.RUNNING;
 *         }
 *
 * @class Action
 * @extends BaseNode
**/
var Action = b3.Class(b3.BaseNode);

var p = Action.prototype;

    /**
     * Node category. Default to `b3.ACTION`.
     *
     * @property category
     * @type {String}
     * @readonly
    **/
    p.category = b3.ACTION;

    p.__BaseNode_initialize = p.initialize;
    /**
     * Initialization method.
     *
     * @method initialize
     * @constructor
    **/
    p.initialize = function() {
        this.__BaseNode_initialize();
    }

b3.Action = Action;

})();/**
 * Composite
 *
 * Copyright (c) 2014 Renato de Pontes Pereira.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to 
 * deal in the Software without restriction, including without limitation the 
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
**/

/**
 * @module Behavior3JS
 **/

// namespace:
this.b3 = this.b3 || {};

(function() {
"use strict";

/**
 * Composite is the base class for all composite nodes. Thus, if you want to 
 * create new custom composite nodes, you need to inherit from this class. 
 * 
 * When creating composite nodes, you will need to propagate the tick signal to
 * the children nodes manually. To do that, override the `tick` method and call 
 * the `_execute` method on all nodes. For instance, take a look at how the 
 * Sequence node inherit this class and how it call its children:
 *
 *
 *     // Inherit from Composite, using the util function Class.
 *     var Sequence = b3.Class(b3.Composite);
 *     var p = Sequence.prototype;
 *
 *         // Remember to set the name of the node. 
 *         p.name = 'Sequence';
 *         
 *         // Override the tick function
 *         p.tick = function(tick) {
 *
 *             // Iterates over the children
 *             for (var i=0; i<this.children.length; i++) {
 *
 *                 // Propagate the tick
 *                 var status = this.children[i]._execute(tick);
 * 
 *                 if (status !== b3.SUCCESS) {
 *                     return status;
 *                 }
 *             }
 *
 *             return b3.SUCCESS;
 *         }
 *
 * @class Composite
 * @extends BaseNode
**/
var Composite = b3.Class(b3.BaseNode);

var p = Composite.prototype;

    /**
     * Node category. Default to `b3.COMPOSITE`.
     *
     * @property category
     * @type {String}
     * @readonly
    **/
    p.category = b3.COMPOSITE;

    p.__BaseNode_initialize = p.initialize;
    /**
     * Initialization method.
     *
     * @method initialize
     * @constructor
    **/
    p.initialize = function(settings) {
        settings = settings || {};

        this.__BaseNode_initialize();

        this.children = (settings.children || []).slice(0);
    };

b3.Composite = Composite;

})();/**
 * Decorator
 *
 * Copyright (c) 2014 Renato de Pontes Pereira.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to 
 * deal in the Software without restriction, including without limitation the 
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
**/

/**
 * @module Behavior3JS
 **/

// namespace:
this.b3 = this.b3 || {};

(function() {
"use strict";

/**
 * Decorator is the base class for all decorator nodes. Thus, if you want to 
 * create new custom decorator nodes, you need to inherit from this class. 
 * 
 * When creating decorator nodes, you will need to propagate the tick signal to
 * the child node manually, just like the composite nodes. To do that, override
 * the `tick` method and call the `_execute` method on the child node. For 
 * instance, take a look at how the Inverter node inherit this class and how it
 * call its children:
 *
 *
 *     // Inherit from Decorator, using the util function Class.
 *     var Inverter = b3.Class(b3.Decorator);
 *     var p = Inverter.prototype;
 *     
 *         // Remember to set the name of the node. 
 *         p.name = 'Inverter';
 *     
 *         // Override the tick function
 *         p.tick = function(tick) {
 *             if (!this.child) {
 *                 return b3.ERROR;
 *             }
 *     
 *             // Propagate the tick
 *             var status = this.child._execute(tick);
 *     
 *             if (status == b3.SUCCESS)
 *                 status = b3.FAILURE;
 *             else if (status == b3.FAILURE)
 *                 status = b3.SUCCESS;
 *     
 *             return status;
 *         };
 *
 * @class Decorator
 * @extends BaseNode
**/
var Decorator = b3.Class(b3.BaseNode);

var p = Decorator.prototype;

    /**
     * Node category. Default to b3.DECORATOR.
     *
     * @property category
     * @type {String}
     * @readonly
    **/
    p.category = b3.DECORATOR;

    p.__BaseNode_initialize = p.initialize;
    /**
     * Initialization method.
     *
     * @method initialize
     * @constructor
    **/
    p.initialize = function(settings) {
        settings = settings || {};

        this.__BaseNode_initialize();

        this.child = settings.child || null;
    };

b3.Decorator = Decorator;

})();/**
 * Condition
 *
 * Copyright (c) 2014 Renato de Pontes Pereira.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to 
 * deal in the Software without restriction, including without limitation the 
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
**/

/**
 * @module Behavior3JS
 **/

// namespace:
this.b3 = this.b3 || {};

(function() {
"use strict";

/**
 * Condition is the base class for all condition nodes. Thus, if you want to 
 * create new custom condition nodes, you need to inherit from this class. 
 *
 * @class Condition
 * @extends BaseNode
**/
var Condition = b3.Class(b3.BaseNode);

var p = Condition.prototype;

    /**
     * Node category. Default to `b3.CONDITION`.
     *
     * @property category
     * @type {String}
     * @readonly
    **/
    p.category = b3.CONDITION;

    p.__BaseNode_initialize = p.initialize;
    /**
     * Initialization method.
     *
     * @method initialize
     * @constructor
    **/
    p.initialize = function() {
        this.__BaseNode_initialize();
    }

b3.Condition = Condition;

})();/**
 * Sequence
 *
 * Copyright (c) 2014 Renato de Pontes Pereira.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to 
 * deal in the Software without restriction, including without limitation the 
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
**/

/**
 * @module Behavior3JS
 **/

// namespace:
this.b3 = this.b3 || {};

(function() {
"use strict";

/**
 * The Sequence node ticks its children sequentially until one of them returns 
 * `FAILURE`, `RUNNING` or `ERROR`. If all children return the success state, 
 * the sequence also returns `SUCCESS`.
 *
 * @class Sequence
 * @extends Composite
**/
var Sequence = b3.Class(b3.Composite);

var p = Sequence.prototype;

    /**
     * Node name. Default to `Sequence`.
     *
     * @property name
     * @type {String}
     * @readonly
    **/
    p.name = 'Sequence';

    /**
     * Tick method.
     *
     * @method tick
     * @param {b3.Tick} tick A tick instance.
     * @returns {Constant} A state constant.
    **/
    p.tick = function(tick) {
        for (var i=0; i<this.children.length; i++) {
            var status = this.children[i]._execute(tick);

            if (status !== b3.SUCCESS) {
                return status;
            }
        }

        return b3.SUCCESS;
    }

b3.Sequence = Sequence;

})();/**
 * Priority
 *
 * Copyright (c) 2014 Renato de Pontes Pereira.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to 
 * deal in the Software without restriction, including without limitation the 
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
**/

/**
 * @module Behavior3JS
 **/

// namespace:
this.b3 = this.b3 || {};

(function() {
"use strict";

/**
 * Priority ticks its children sequentially until one of them returns 
 * `SUCCESS`, `RUNNING` or `ERROR`. If all children return the failure state, 
 * the priority also returns `FAILURE`.
 *
 * @class Priority
 * @extends Composite
**/
var Priority = b3.Class(b3.Composite);

var p = Priority.prototype

    /**
     * Node name. Default to `Priority`.
     *
     * @property name
     * @type String
     * @readonly
    **/
    p.name = 'Priority';

    /**
     * Tick method.
     *
     * @method tick
     * @param {Tick} tick A tick instance.
     * @returns {Constant} A state constant.
    **/
    p.tick = function(tick) {
        for (var i=0; i<this.children.length; i++) {
            var status = this.children[i]._execute(tick);

            if (status !== b3.FAILURE) {
                return status;
            }
        }

        return b3.FAILURE;
    }

b3.Priority = Priority;

})();/**
 * MemSequence
 *
 * Copyright (c) 2014 Renato de Pontes Pereira.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to 
 * deal in the Software without restriction, including without limitation the 
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
**/

/**
 * @module Behavior3JS
 **/

// namespace:
this.b3 = this.b3 || {};

(function() {
"use strict";

/**
 * MemSequence is similar to Sequence node, but when a child returns a 
 * `RUNNING` state, its index is recorded and in the next tick the MemPriority 
 * call the child recorded directly, without calling previous children again.
 *
 * @class MemPriority
 * @extends Composite
**/
var MemSequence = b3.Class(b3.Composite);

var p = MemSequence.prototype

    /**
     * Node name. Default to `MemSequence`.
     *
     * @property name
     * @type {String}
     * @readonly
    **/
    p.name = 'MemSequence';

    /**
     * Open method.
     *
     * @method open
     * @param {b3.Tick} tick A tick instance.
    **/
    p.open = function(tick) {
        tick.blackboard.set('runningChild', 0, tick.tree.id, this.id);
    }

    /**
     * Tick method.
     *
     * @method tick
     * @param {b3.Tick} tick A tick instance.
     * @returns {Constant} A state constant.
    **/
    p.tick = function(tick) {
        var child = tick.blackboard.get('runningChild', tick.tree.id, this.id);
        for (var i=child; i<this.children.length; i++) {
            var status = this.children[i]._execute(tick);

            if (status !== b3.SUCCESS) {
                if (status === b3.RUNNING) {
                    tick.blackboard.set('runningChild', i, tick.tree.id, this.id);
                }
                return status;
            }
        }

        return b3.SUCCESS;
    }

b3.MemSequence = MemSequence;

})();/**
 * MemPriority
 *
 * Copyright (c) 2014 Renato de Pontes Pereira.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to 
 * deal in the Software without restriction, including without limitation the 
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
**/

/**
 * @module Behavior3JS
 **/

// namespace:
this.b3 = this.b3 || {};

(function() {
"use strict";

/**
 * MemPriority is similar to Priority node, but when a child returns a 
 * `RUNNING` state, its index is recorded and in the next tick the, MemPriority 
 * calls the child recorded directly, without calling previous children again.
 *
 * @class MemPriority
 * @extends Composite
**/
var MemPriority = b3.Class(b3.Composite);

var p = MemPriority.prototype;

    /**
     * Node name. Default to `MemPriority`.
     *
     * @property name
     * @type {String}
     * @readonly
    **/
    p.name = 'MemPriority';

    /**
     * Open method.
     *
     * @method open
     * @param {b3.Tick} tick A tick instance.
    **/
    p.open = function(tick) {
        tick.blackboard.set('runningChild', 0, tick.tree.id, this.id);
    }

    /**
     * Tick method.
     *
     * @method tick
     * @param {b3.Tick} tick A tick instance.
     * @returns {Constant} A state constant.
    **/
    p.tick = function(tick) {
        var child = tick.blackboard.get('runningChild', tick.tree.id, this.id);
        for (var i=child; i<this.children.length; i++) {
            var status = this.children[i]._execute(tick);

            if (status !== b3.FAILURE) {
                if (status === b3.RUNNING) {
                    tick.blackboard.set('runningChild', i, tick.tree.id, this.id);
                }
                return status;
            }
        }

        return b3.FAILURE;
    }

b3.MemPriority = MemPriority;

})();/**
 * Inverter
 *
 * Copyright (c) 2014 Renato de Pontes Pereira.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to 
 * deal in the Software without restriction, including without limitation the 
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
**/

/**
 * @module Behavior3JS
 **/

// namespace:
this.b3 = this.b3 || {};

(function() {
"use strict";

/**
 * The Inverter decorator inverts the result of the child, returning `SUCCESS`
 * for `FAILURE` and `FAILURE` for `SUCCESS`.
 *
 * @class Inverter
 * @extends Decorator
**/
var Inverter = b3.Class(b3.Decorator);

var p = Inverter.prototype;

    /**
     * Node name. Default to `Inverter`.
     *
     * @property name
     * @type {String}
     * @readonly
    **/
    p.name = 'Inverter';

    /**
     * Tick method.
     *
     * @method tick
     * @param {Tick} tick A tick instance.
     * @returns {Constant} A state constant.
    **/
    p.tick = function(tick) {
        if (!this.child) {
            return b3.ERROR;
        }

        var status = this.child._execute(tick);

        if (status == b3.SUCCESS)
            status = b3.FAILURE;
        else if (status == b3.FAILURE)
            status = b3.SUCCESS;

        return status;
    };

b3.Inverter = Inverter;

})();/**
 * Limiter
 *
 * Copyright (c) 2014 Renato de Pontes Pereira.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to 
 * deal in the Software without restriction, including without limitation the 
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
**/

/**
 * @module Behavior3JS
 **/

// namespace:
this.b3 = this.b3 || {};

(function() {
"use strict";

/**
 * This decorator limit the number of times its child can be called. After a
 * certain number of times, the Limiter decorator returns `FAILURE` without 
 * executing the child.
 *
 * @class Limiter
 * @extends Decorator
**/
var Limiter = b3.Class(b3.Decorator);

var p = Limiter.prototype;

    /**
     * Node name. Default to `Limiter`.
     *
     * @property name
     * @type {String}
     * @readonly
    **/
    p.name = 'Limiter';

    /**
     * Node title. Default to `Limit X Activations`. Used in Editor.
     *
     * @property title
     * @type {String}
     * @readonly
    **/
    p.title = 'Limit <maxLoop> Activations';

    /**
     * Node parameters.
     *
     * @property parameters
     * @type {String}
     * @readonly
    **/
    p.parameters = {'maxLoop': 1};
    
    p.__Decorator_initialize = p.initialize;
    /**
     * Initialization method. 
     *
     * Settings parameters:
     *
     * - **maxLoop** (*Integer*) Maximum number of repetitions.
     * - **child** (*BaseNode*) The child node.
     *
     * @method initialize
     * @param {Object} settings Object with parameters.
     * @constructor
    **/
    p.initialize = function(settings) {
        settings = settings || {};

        this.__Decorator_initialize(settings);

        if (!settings.maxLoop) {
            throw "maxLoop parameter in Limiter decorator is an obligatory " +
                  "parameter";
        }

        this.maxLoop = settings.maxLoop;
    }

    /**
     * Open method.
     *
     * @method open
     * @param {Tick} tick A tick instance.
    **/
    p.open = function(tick) {
        tick.blackboard.set('i', 0, tick.tree.id, this.id);
    }

    /**
     * Tick method.
     *
     * @method tick
     * @param {Tick} tick A tick instance.
     * @returns {Constant} A state constant.
    **/
    p.tick = function(tick) {
        if (!this.child) {
            return b3.ERROR;
        }

        var i = tick.blackboard.get('i', tick.tree.id, this.id);

        if (i < this.maxLoop) {
            var status = this.child._execute(tick);

            if (status == b3.SUCCESS || status == b3.FAILURE)
                tick.blackboard.set('i', i+1, tick.tree.id, this.id);
            
            return status;
        }

        return b3.FAILURE;        
    }

b3.Limiter = Limiter;

})();/**
 * MaxTime
 *
 * Copyright (c) 2014 Renato de Pontes Pereira.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to 
 * deal in the Software without restriction, including without limitation the 
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
**/

/**
 * @module Behavior3JS
 **/

// namespace:
this.b3 = this.b3 || {};

(function() {
"use strict";

/**
 * The MaxTime decorator limits the maximum time the node child can execute. 
 * Notice that it does not interrupt the execution itself (i.e., the child must
 * be non-preemptive), it only interrupts the node after a `RUNNING` status.
 *
 * @class MaxTime
 * @extends Decorator
**/
var MaxTime = b3.Class(b3.Decorator);

var p = MaxTime.prototype;

    /**
     * Node name. Default to `MaxTime`.
     *
     * @property name
     * @type {String}
     * @readonly
    **/
    p.name = 'MaxTime';

    /**
     * Node title. Default to `Max XXms`. Used in Editor.
     *
     * @property title
     * @type {String}
     * @readonly
    **/
    p.title = 'Max <maxTime>ms';

    /**
     * Node parameters.
     *
     * @property parameters
     * @type {String}
     * @readonly
    **/
    p.parameters = {'maxTime': 0};

    p.__Decorator_initialize = p.initialize;
    /**
     * Initialization method.
     *
     * Settings parameters:
     *
     * - **maxTime** (*Integer*) Maximum time a child can execute.
     * - **child** (*BaseNode*) The child node.
     *
     * @method initialize
     * @param {Object} settings Object with parameters.
     * @constructor
    **/
    p.initialize = function(settings) {
        settings = settings || {};

        this.__Decorator_initialize(settings);

        if (!settings.maxTime) {
            throw "maxTime parameter in MaxTime decorator is an obligatory " +
                  "parameter";
        }

        this.maxTime = settings.maxTime;
    };

    /**
     * Open method.
     *
     * @method open
     * @param {Tick} tick A tick instance.
    **/
    p.open = function(tick) {
        var startTime = (new Date()).getTime();
        tick.blackboard.set('startTime', startTime, tick.tree.id, this.id);
    };
    
    /**
     * Tick method.
     *
     * @method tick
     * @param {Tick} tick A tick instance.
     * @returns {Constant} A state constant.
    **/
    p.tick = function(tick) {
        if (!this.child) {
            return b3.ERROR;
        }
        
        var currTime = (new Date()).getTime();
        var startTime = tick.blackboard.get('startTime', tick.tree.id, this.id);
        
        var status = this.child._execute(tick);
        if (currTime - startTime > this.maxTime) {
            return b3.FAILURE;
        }
        
        return status;
    };

b3.MaxTime = MaxTime;

})();/**
 * Repeater
 *
 * Copyright (c) 2014 Renato de Pontes Pereira.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to 
 * deal in the Software without restriction, including without limitation the 
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
**/

/**
 * @module Behavior3JS
 **/

// namespace:
this.b3 = this.b3 || {};

(function() {
"use strict";

/**
 * Repeater is a decorator that repeats the tick signal until the child node 
 * return `RUNNING` or `ERROR`. Optionally, a maximum number of repetitions 
 * can be defined.
 *
 * @class Repeater
 * @extends Decorator
**/
var Repeater = b3.Class(b3.Decorator);

var p = Repeater.prototype;

    /**
     * Node name. Default to `Repeater`.
     *
     * @property name
     * @type {String}
     * @readonly
    **/
    p.name = 'Repeater';

    /**
     * Node title. Default to `Repeat XXx`. Used in Editor.
     *
     * @property title
     * @type {String}
     * @readonly
    **/
    p.title = 'Repeat <maxLoop>x';

    /**
     * Node parameters.
     *
     * @property parameters
     * @type {String}
     * @readonly
    **/
    p.parameters = {'maxLoop': -1};

    p.__Decorator_initialize = p.initialize;
    /**
     * Initialization method.
     *
     * Settings parameters:
     *
     * - **maxLoop** (*Integer*) Maximum number of repetitions. Default to -1 
     *                           (infinite).
     * - **child** (*BaseNode*) The child node.
     * 
     * @method initialize
     * @param {Object} settings Object with parameters.
     * @constructor
    **/
    p.initialize = function(settings) {
        settings = settings || {};

        this.__Decorator_initialize(settings);

        this.maxLoop = settings.maxLoop || -1;
    };

    /**
     * Open method.
     *
     * @method open
     * @param {Tick} tick A tick instance.
    **/
    p.open = function(tick) {
        tick.blackboard.set('i', 0, tick.tree.id, this.id);
    };

    /**
     * Tick method.
     *
     * @method tick
     * @param {Tick} tick A tick instance.
    **/
    p.tick = function(tick) {
        if (!this.child) {
            return b3.ERROR;
        }

        var i = tick.blackboard.get('i', tick.tree.id, this.id);
        var status = b3.SUCCESS;

        while (this.maxLoop < 0 || i < this.maxLoop) {
            status = this.child._execute(tick);

            if (status == b3.SUCCESS || status == b3.FAILURE)
                i++;
            else
                break;
        }

        i = tick.blackboard.set('i', i, tick.tree.id, this.id);
        return status;
    };

b3.Repeater = Repeater;

})();/**
 * RepeatUntilFailure
 *
 * Copyright (c) 2014 Renato de Pontes Pereira.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to 
 * deal in the Software without restriction, including without limitation the 
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
**/

/**
 * @module Behavior3JS
 **/

// namespace:
this.b3 = this.b3 || {};

(function() {
"use strict";

/**
 * RepeatUntilFailure is a decorator that repeats the tick signal until the 
 * node child returns `FAILURE`, `RUNNING` or `ERROR`. Optionally, a maximum 
 * number of repetitions can be defined.
 *
 * @class RepeatUntilFailure
 * @extends Decorator
**/
var RepeatUntilFailure = b3.Class(b3.Decorator);

var p = RepeatUntilFailure.prototype;

    /**
     * Node name. Default to `RepeatUntilFailure`.
     *
     * @property name
     * @type {String}
     * @readonly
    **/
    p.name = 'RepeatUntilFailure';

    /**
     * Node title. Default to `Repeat Until Failure`.
     *
     * @property title
     * @type {String}
     * @readonly
    **/
    p.title = 'Repeat Until Failure';

    /**
     * Node parameters.
     *
     * @property parameters
     * @type {String}
     * @readonly
    **/
    p.parameters = {'maxLoop': -1};

    p.__Decorator_initialize = p.initialize;
    /**
     * Initialization method.
     *
     * Settings parameters:
     *
     * - **maxLoop** (*Integer*) Maximum number of repetitions. Default to -1 
     *                           (infinite).
     * - **child** (*BaseNode*) The child node.
     *
     * @method initialize
     * @param {Object} settings Object with parameters.
     * @constructor
    **/
    p.initialize = function(settings) {
        settings = settings || {};

        this.__Decorator_initialize(settings);

        this.maxLoop = settings.maxLoop || -1;
    }

    /**
     * Open method.
     *
     * @method open
     * @param {Tick} tick A tick instance.
    **/
    p.open = function(tick) {
        tick.blackboard.set('i', 0, tick.tree.id, this.id);
    }

    /**
     * Tick method.
     *
     * @method tick
     * @param {Tick} tick A tick instance.
     * @returns {Constant} A state constant.
    **/
    p.tick = function(tick) {
        if (!this.child) {
            return b3.ERROR;
        }

        var i = tick.blackboard.get('i', tick.tree.id, this.id);

        while (this.maxLoop < 0 || i < this.maxLoop) {
            var status = this.child._execute(tick);

            if (status == b3.SUCCESS)
                i++;
            else
                break;
        }

        var i = tick.blackboard.set('i', i, tick.tree.id, this.id);
        return status;
    }

b3.RepeatUntilFailure = RepeatUntilFailure;

})();/**
 * RepeatUntilSuccess
 *
 * Copyright (c) 2014 Renato de Pontes Pereira.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to 
 * deal in the Software without restriction, including without limitation the 
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
**/

/**
 * @module Behavior3JS
 **/

// namespace:
this.b3 = this.b3 || {};

(function() {
"use strict";

/**
 * RepeatUntilSuccess is a decorator that repeats the tick signal until the 
 * node child returns `SUCCESS`, `RUNNING` or `ERROR`. Optionally, a maximum 
 * number of repetitions can be defined.
 *
 * @class RepeatUntilSuccess
 * @extends Decorator
**/
var RepeatUntilSuccess = b3.Class(b3.Decorator);

var p = RepeatUntilSuccess.prototype;

    /**
     * Node name. Default to `RepeatUntilSuccess`.
     *
     * @property name
     * @type {String}
     * @readonly
    **/
    p.name = 'RepeatUntilSuccess';

    /**
     * Node title. Default to `Repeat Until Success`.
     *
     * @property title
     * @type {String}
     * @readonly
    **/
    p.title = 'Repeat Until Success';
    
    /**
     * Node parameters.
     *
     * @property parameters
     * @type {String}
     * @readonly
    **/
    p.parameters = {'maxLoop': -1};
    
    p.__Decorator_initialize = p.initialize;
    /**
     * Initialization method.
     *
     * Settings parameters:
     *
     * - **maxLoop** (*Integer*) Maximum number of repetitions. Default to -1 
     *                           (infinite).
     * - **child** (*BaseNode*) The child node.
     *
     * @method initialize
     * @param {Object} settings Object with parameters.
     * @constructor
    **/
    p.initialize = function(settings) {
        settings = settings || {};

        this.__Decorator_initialize(settings);

        this.maxLoop = settings.maxLoop || -1;
    }

    /**
     * Open method.
     *
     * @method open
     * @param {Tick} tick A tick instance.
    **/
    p.open = function(tick) {
        tick.blackboard.set('i', 0, tick.tree.id, this.id);
    }

    /**
     * Tick method.
     *
     * @method tick
     * @param {Tick} tick A tick instance.
     * @returns {Constant} A state constant.
    **/
    p.tick = function(tick) {
        if (!this.child) {
            return b3.ERROR;
        }

        var i = tick.blackboard.get('i', tick.tree.id, this.id);

        while (this.maxLoop < 0 || i < this.maxLoop) {
            var status = this.child._execute(tick);

            if (status == b3.FAILURE)
                i++;
            else
                break;
        }

        var i = tick.blackboard.set('i', i, tick.tree.id, this.id);
        return status;
    }

b3.RepeatUntilSuccess = RepeatUntilSuccess;

})();/**
 * Error
 *
 * Copyright (c) 2014 Renato de Pontes Pereira.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to 
 * deal in the Software without restriction, including without limitation the 
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
**/

/**
 * @module Behavior3JS
 **/

// namespace:
this.b3 = this.b3 || {};

(function() {
"use strict";

/**
 * This action node returns `ERROR` always.
 *
 * @class Error
 * @extends Action
**/
var Error = b3.Class(b3.Action);

var p = Error.prototype;

    /**
     * Node name. Default to `Error`.
     *
     * @property name
     * @type {String}
     * @readonly
    **/
    p.name = 'Error';

    /**
     * Tick method.
     *
     * @method tick
     * @param {b3.Tick} tick A tick instance.
     * @returns {Constant} Always return `b3.ERROR`.
    **/
    p.tick = function(tick) {
        return b3.ERROR;
    }

b3.Error = Error;

})();/**
 * Failer
 *
 * Copyright (c) 2014 Renato de Pontes Pereira.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to 
 * deal in the Software without restriction, including without limitation the 
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
**/

/**
 * @module Behavior3JS
 **/

// namespace:
this.b3 = this.b3 || {};

(function() {
"use strict";

/**
 * This action node returns `FAILURE` always.
 *
 * @class Failer
 * @extends Action
**/
var Failer = b3.Class(b3.Action);

var p = Failer.prototype;

    /**
     * Node name. Default to `Failer`.
     *
     * @property name
     * @type {String}
     * @readonly
    **/
    p.name = 'Failer';

    /**
     * Tick method.
     *
     * @method tick
     * @param {b3.Tick} tick A tick instance.
     * @returns {Constant} Always return `b3.FAILURE`.
    **/
    p.tick = function(tick) {
        return b3.FAILURE;
    }

b3.Failer = Failer;

})();/**
 * Runner
 *
 * Copyright (c) 2014 Renato de Pontes Pereira.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to 
 * deal in the Software without restriction, including without limitation the 
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
**/

/**
 * @module Behavior3JS
 **/

// namespace:
this.b3 = this.b3 || {};

(function() {
"use strict";

/**
 * This action node returns RUNNING always.
 *
 * @class Runner
 * @extends Action
**/
var Runner = b3.Class(b3.Action);

var p = Runner.prototype;

    /**
     * Node name. Default to `Runner`.
     *
     * @property name
     * @type {String}
     * @readonly
    **/
    p.name = 'Runner';

    /**
     * Tick method.
     *
     * @method tick
     * @param {b3.Tick} tick A tick instance.
     * @returns {Constant} Always return `b3.RUNNING`.
    **/
    p.tick = function(tick) {
        return b3.RUNNING;
    }

b3.Runner = Runner;

})();/**
 * Succeeder
 *
 * Copyright (c) 2014 Renato de Pontes Pereira.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to 
 * deal in the Software without restriction, including without limitation the 
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
**/

/**
 * @module Behavior3JS
 **/

// namespace:
this.b3 = this.b3 || {};

(function() {
"use strict";

/**
 * This action node returns `SUCCESS` always.
 *
 * @class Succeeder
 * @extends Action
**/
var Succeeder = b3.Class(b3.Action);

var p = Succeeder.prototype;

    /**
     * Node name. Default to `Succeeder`.
     *
     * @property name
     * @type String
     * @readonly
    **/
    p.name = 'Succeeder';

    /**
     * Tick method.
     *
     * @method tick
     * @param {b3.Tick} tick A tick instance.
     * @returns {Constant} Always return `b3.SUCCESS`.
    **/
    p.tick = function(tick) {
        return b3.SUCCESS;
    }

b3.Succeeder = Succeeder;

})();/**
 * Wait
 *
 * Copyright (c) 2014 Renato de Pontes Pereira.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to 
 * deal in the Software without restriction, including without limitation the 
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
**/

/**
 * @module Behavior3JS
 **/

// namespace:
this.b3 = this.b3 || {};

(function() {
"use strict";

/**
 * Wait a few seconds.
 *
 * @class Wait
 * @extends Action
**/
var Wait = b3.Class(b3.Action);

var p = Wait.prototype;
    
    /**
     * Node name. Default to `Wait`.
     *
     * @property name
     * @type {String}
     * @readonly
    **/
    p.name = 'Wait';

    /**
     * Node title. Default to `Wait XXms`. Used in Editor.
     *
     * @property title
     * @type {String}
     * @readonly
    **/
    p.title = 'Wait <milliseconds>ms';

    /**
     * Node parameters.
     *
     * @property parameters
     * @type {String}
     * @readonly
    **/
    p.parameters = {'milliseconds': 0};

    p.__Action_initialize = p.initialize;
    /**
     * Initialization method.
     *
     * Settings parameters:
     *
     * - **milliseconds** (*Integer*) Maximum time, in milliseconds, a child
     *                                can execute.
     *
     * @method initialize
     * @param {Object} settings Object with parameters.
     * @constructor
    **/
    p.initialize = function(settings) {
        settings = settings || {};

        this.__Action_initialize();

        this.endTime = settings.milliseconds || 0;
    }

    /**
     * Open method.
     *
     * @method open
     * @param {Tick} tick A tick instance.
    **/
    p.open = function(tick) {
        var startTime = (new Date()).getTime();
        tick.blackboard.set('startTime', startTime, tick.tree.id, this.id);
    }

    /**
     * Tick method.
     *
     * @method tick
     * @param {Tick} tick A tick instance.
     * @returns {Constant} A state constant.
    **/
    p.tick = function(tick) {
        var currTime = (new Date()).getTime();
        var startTime = tick.blackboard.get('startTime', tick.tree.id, this.id);
        
        if (currTime - startTime > this.endTime) {
            return b3.SUCCESS;
        }
        
        return b3.RUNNING;
    }

b3.Wait = Wait;

})();