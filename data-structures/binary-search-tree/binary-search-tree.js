/*
 * Binary Search Tree implementation in JavaScript
 * Copyright (c) 2009 Nicholas C. Zakas
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var preOrder = function(node, process) {
    if (node) {
        // first process the node
        process.call(this, node);
        // first left ...
        if (node.left !== null) {
            preOrder(node.left, process);
        }
        // then right ...
        if (node.right !== null) {
            preOrder(node.right, process);
        }
    }
},
postOrder = function(node, process) {
    if (node) {
        // first left ...
        if (node.left !== null) {
            postOrder(node.left, process);
        }
        // then right ...
        if (node.right !== null) {
            postOrder(node.right, process);
        }
        // finally process the node
        process.call(this, node);
    }
},
inOrder = function(node, process) {
    if (node) {
        //traverse the left subtree
        if (node.left !== null) {
            inOrder(node.left, process);
        }
        
        //call the process method on this node
        process.call(this, node);
        
        //traverse the right subtree
        if (node.right !== null) {
            inOrder(node.right, process);
        }
    }
};

/**
 * A binary search tree implementation in JavaScript. This implementation
 * does not allow duplicate values to be inserted into the tree, ensuring
 * that there is just one instance of each value.
 * @class BinarySearchTree
 * @constructor
 */
function BinarySearchTree() {
    
    /**
     * Pointer to root node in the tree.
     * @property _root
     * @type Object
     * @private
     */
    this._root = null;
}

BinarySearchTree.prototype = {

    //restore constructor
    constructor: BinarySearchTree,
    
    //-------------------------------------------------------------------------
    // Private members
    //-------------------------------------------------------------------------
    
    /**
     * Appends some data to the appropriate point in the tree. If there are no
     * nodes in the tree, the data becomes the root. If there are other nodes
     * in the tree, then the tree must be traversed to find the correct spot
     * for insertion. 
     * @param {variant} value The data to add to the list.
     * @return {Void}
     * @method add
     */
    add: function (value){
    
        //create a new item object, place data in
        var node = { 
                value: value, 
                left: null,
                right: null 
            },
            
            //used to traverse the structure
            current;
    
        //special case: no items in the tree yet
        if (this._root === null){
            this._root = node;
        } else {
            current = this._root;
            
            while(true){
            
                //if the new value is less than this node's value, go left
                if (value < current.value){
                
                    //if there's no left, then the new node belongs there
                    if (current.left === null){
                        current.left = node;
                        break;
                    } else {                    
                        current = current.left;
                    }
                    
                //if the new value is greater than this node's value, go right
                } else if (value > current.value){
                
                    //if there's no right, then the new node belongs there
                    if (current.right === null){
                        current.right = node;
                        break;
                    } else {                    
                        current = current.right;
                    }       
 
                //if the new value is equal to the current one, just ignore
                } else {
                    break;
                }
            }        
        }
    },
    
    /**
     * Determines if the given value is present in the tree.
     * @param {variant} value The value to find.
     * @return {Boolean} True if the value is found, false if not.
     * @method contains
     */
    contains: function(value){
    
        var found       = false,
            current     = this._root
            
        //make sure there's a node to search
        while(!found && current){
        
            //if the value is less than the current node's, go left
            if (value < current.value){
                current = current.left;
                
            //if the value is greater than the current node's, go right
            } else if (value > current.value){
                current = current.right;
                
            //values are equal, found it!
            } else {
                found = true;
            }
        }
        
        //only proceed if the node was found
        return found;

    },
    
    /**
     * Removes the node with the given value from the tree. This may require
     * moving around some nodes so that the binary search tree remains
     * properly balanced.
     * @param {variant} value The value to remove.
     * @return {void}
     * @method remove
     */
    remove: function(value){
    
        var found       = false,
            parent      = null,
            current     = this._root,
            childCount,
            replacement,
            replacementParent;
            
        //make sure there's a node to search
        while(!found && current){
        
            //if the value is less than the current node's, go left
            if (value < current.value){
                parent = current;
                current = current.left;
                
            //if the value is greater than the current node's, go right
            } else if (value > current.value){
                parent = current;
                current = current.right;
                
            //values are equal, found it!
            } else {
                found = true;
            }
        }
        
        //only proceed if the node was found
        if (found){
        
            //figure out how many children
            childCount = (current.left !== null ? 1 : 0) + (current.right !== null ? 1 : 0);
        
            //special case: the value is at the root
            if (current === this._root){
                switch(childCount){
                
                    //no children, just erase the root
                    case 0:
                        this._root = null;
                        break;
                        
                    //one child, use one as the root
                    case 1:
                        this._root = (current.right === null ? current.left : current.right);
                        break;
                        
                    //two children, little work to do
                    case 2:

                        //new root will be the old root's left child...maybe
                        replacement = this._root.left;
                        
                        //find the right-most leaf node to be the real new root
                        while (replacement.right !== null){
                            replacementParent = replacement;
                            replacement = replacement.right;
                        }
         
                        //it's not the first node on the left
                        if (replacementParent !== null){
                        
                            //remove the new root from it's previous position
                            replacementParent.right = replacement.left;
                            
                            //give the new root all of the old root's children
                            replacement.right = this._root.right;
                            replacement.left = this._root.left;
                        } else {
                        
                            //just assign the children
                            replacement.right = this._root.right;
                        }
                        
                        //officially assign new root
                        this._root = replacement;
                    
                    //no default
                
                }        

            //non-root values
            } else {
            
                switch (childCount){
                
                    //no children, just remove it from the parent
                    case 0:
                        //if the current value is less than its parent's, null out the left pointer
                        if (current.value < parent.value){
                            parent.left = null;
                            
                        //if the current value is greater than its parent's, null out the right pointer
                        } else {
                            parent.right = null;
                        }
                        break;
                        
                    //one child, just reassign to parent
                    case 1:
                        //if the current value is less than its parent's, reset the left pointer
                        if (current.value < parent.value){
                            parent.left = (current.left === null ? current.right : current.left);
                            
                        //if the current value is greater than its parent's, reset the right pointer
                        } else {
                            parent.right = (current.left === null ? current.right : current.left);
                        }
                        break;    

                    //two children, a bit more complicated
                    case 2:
                    
                        //reset pointers for new traversal
                        replacement = current.left;
                        replacementParent = current;
                        
                        //find the right-most node
                        while(replacement.right !== null){
                            replacementParent = replacement;
                            replacement = replacement.right;                            
                        }
                    
                        replacementParent.right = replacement.left;
                        
                        //assign children to the replacement
                        replacement.right = current.right;
                        replacement.left = current.left;
                        
                        //place the replacement in the right spot
                        if (current.value < parent.value){
                            parent.left = replacement;
                        } else {
                            parent.right = replacement;
                        }                        
                                        
                    //no default
                
                
                }
            
            }
        
        }
        
    },
    
    /**
     * Returns the number of items in the tree. To do this, a traversal
     * must be executed.
     * @return {int} The number of items in the tree.
     * @method size
     */
    size: function(){
        var length = 0;
        
        this.traverse(function(node){
            length++;
        });
        
        return length;
    },
    
    /**
     * Converts the tree into an array.
     * @return {Array} An array containing all of the data in the tree.
     * @method toArray
     */
    toArray: function(){
        var result = [];
        
        this.traverse(function(node){
            result.push(node.value);
        });
        
        return result;
    },
    
    /**
     * Converts the list into a string representation.
     * @return {String} A string representation of the list.
     * @method toString
     */
    toString: function(){
        return this.toArray().toString();
    },
    
    /**
     * Traverses the tree and runs the given method on each node it comes
     * across while doing an in-order traversal.
     * @param {Function} process The function to run on each node.
     * @param {String} traversalMethod Identifier for the traversal method to use.
     * This parameter is optional - defaults to an inOrder traversal. Other options
     * include preOrder and postOrder.
     * @param {Node} start the node at which to start the traversal. This parameter
     * is optional - defaults to the root node.
     * @return {void}
     * @method traverse
     */
    traverse: function(process, traversalMethod, start) {
        traversalMethod = traversalMethod || 'inOrder';
        start = start || this._root;
        if (!start) {
            return;
        }
        // normalize input to avoid uppercase/lowercase mixups
        switch (traversalMethod.toLowerCase()) {
            case 'inorder':
                inOrder(start, process);
                break;
            case 'preorder':
                preOrder(start, process);
                break;
            case 'postorder':
                postOrder(start, process);
                break;
            default:
                throw new Error('traversalMethod parameter should be either ommitted or one of inOrder, preOrder or postOrder');
                break;
        }
    },

    /**
     * Gets the smallest value in the BST
     * @return {int} the smallest value in the BST
     * @method minValue
     */
    minValue: function() {
        var current = this._root;
        if (!current) {
            return -1;
        }
        while (current.left) {
            current = current.left;
        }
        return current.value;
    },

    /**
     * Gets the biggest value in the BST
     * @return {int} the biggest value in the BST
     * @method maxValue
     */
    maxValue: function() {
        var current = this._root;
        if (!current) {
            return -1;
        }
        while (current.right) {
            current = current.right;
        }
        return current.value;
    },

    /**
     * Searches the tree for a particular value
     * @param {int} value the value to search for
     * @method depthFirstSearch
     * @return {Node} the node corresponding to the
     * value parameter
     */
    depthFirstSearch: function(value) {
        var node;
        this.traverse(function(n) {
            if (n.value === value) {
                // how to break out of this traversal once the node has been found?
                // need some kind of conditional traversal.
                node = n;
            }
        }, 'preOrder');
        return node;
    },

    /**
     * Gets the number of children for a particular node.
     * @param {Object} node the parent node
     * @method numChildren
     * @return {int} The number of child nodes who are related
     * to the node paramater.
     */
    numChildren: function(node) {
        // default to root
        node = node || this._root, num = 0;
        this.traverse(function(n) {
            num++;
        }, 'inOrder', node);
        // subtract 1 because the node itself is always counted
        return num - 1;
    },

    /**
     * Returns the node closest to the given value parameter.
     * @param {int} value the value to search for in the tree.
     * @method closest
     * @return {Node} node which has the value which is closest
     * to the value parameter.
     */
    closest: function(value) {
        var current;
        this.traverse(function(node) {
            if (!current) {
                // accommodate for the fact that this might be the root node
                current = node;
            } else {
                // otherwise, see if the current difference is greater than the
                // difference between the node's value and the value parameter.
                if (Math.abs(current.value - value) > Math.abs(node.value - value)) {
                    current = node;
                }
            }
        }, 'preOrder');
        return current;
    },

    breadthFirstTraversal: function(process, start) {
        var arr, queue = [], list = [], t = function() {
            var node;
            while (queue.length) {
                node = queue.splice(0, 1)[0];
                if (node.left) {
                    queue.push(node.left);
                }
                if (node.right) {
                    queue.push(node.right);
                }
                list.push(node);
            }
            return list;
        }
        start = start || this._root;
        // ensure that we have a start node at least
        if (!start) {
            return;
        }
        list.push(start);
        if (start.left) {
            queue.push(start.left);
        }
        if (start.right) {
            queue.push(start.right);
        }
        arr = t(list);
        for (var i = 0, l = arr.length; i < l; i++) {
            process.call(this, arr[i]);
        }
    }
};
