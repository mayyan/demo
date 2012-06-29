/*global document: true */
function Typewriter(elem) {

	/*****************************************
	 * Private variables
	 *****************************************/
	/**
     * The element the typewrite effect is attached to.
     * @property _element
     * @type HTMLElement
     */
	var _element = elem;
	
	/**
     * The original string in the element
     * @property _text
     * @type String
     */
	var _text = "";
	
	/**
     * The linked list containing each span nodes. See _init().
     * @property _linkedList
     * @type Object
     */	
	var _linkedList = null;
	
	/*****************************************
	 * Private function
	 *****************************************/
	/**
     * Wrap each character into its own <span>.
	 * Use TextNode as the child node for the span, so that even space can be displayed.
     * @property _init
     */
	function _init() {
		var len,
			i,
			span,
			curr;
			
		_text = _element.innerText; //save the original text
		len = _text.length;
		
		//clear text
		_element.innerText = "";
		
		// build _linkedList
		for (i = 0; i < len; i++) {
			span = document.createElement("span");
			span.appendChild(document.createTextNode(_text.charAt(i)));
			span.style.opacity = 0;
			_element.appendChild(span);
			
			if (i === 0) {
				_linkedList = {};
				curr = _linkedList;
			}
			curr.node = span;
				
			if (i === len - 1) {
				curr.next = null;
			} else {
				curr.next = {};
			}
			
			curr = curr.next;
		}
	}
	_init();
	
	// Wrap all public functions in return object
	return {
		/*****************************************
		 * Public function
		 *****************************************/
		/**
		 * Apply transition on each span with proper delay.
         * @property start()
         */
		start: function () {
			var curr,
				span,
				i = 0;
				
			if (_linkedList) {
				curr = _linkedList;
				while (curr) {
					span = curr.node;
					span.style.webkitTransition = "opacity 0.2s linear " + parseFloat(i * 0.2) + "s";
					span.style.opacity = 1;
					
					curr = curr.next;
					i++;
				}
			}
		},

        /**
		 * Use this function to get the original text in the element
         * @property getText()
		 * @return String
         */		
		getText: function () {
			return _text;
		}
	};
}

