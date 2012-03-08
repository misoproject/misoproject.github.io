(function() {

  var cmconfig = {
    classes: {
      codemirror: 'deck-codemirror',
      codemirrorresult: 'codemirror-result'
    },
    
    selectors: {
      codemirroritem: '.code',
    },

    data : {
      codemirrorified: 'codemirrorified'
    },

    codemirror : {
      lineNumbers : false,
      theme : "default",
      mode : "javascript",
      theme : "default",
      indentUnit : 1,
      indentWithTabs : false,
      runnable : false
    },
    globals : ["Miso", "_", "$"]
  };

  var codemirrorify = function(container) {
    container = $(container);

    if (_.isUndefined(container)) {
      throw new Error("provide container!");
    }

    var codeblocks = container.find(cmconfig.selectors.codemirroritem),
        hiddenScripts  = [],
        cleanupScripts = [];

    $.each(codeblocks, function(i, codeblock) {
      if (!$.data(codeblock, cmconfig.data.codemirrorified)) {
        // initialize defaults.
        var codeblock = $(codeblock),
            editor    = null,
            options   = $.extend(cmconfig.codemirror,
              {
                mode : !!codeblock.attr('mode') ? codeblock.attr('mode') : cmconfig.codemirror.mode,
                theme : !!codeblock.attr('theme') ? codeblock.attr('theme') : cmconfig.codemirror.theme,
                onFocus : function(e) {
                  inEditor = true;
                },
                onBlur : function(e) {
                  inEditor = false;
                },
                readOnly : codeblock.attr("runnable") === "false" ? true : false
              }
            );

        // scan through the text and remove the min amount of spaces
        // so that the indentation is properly done.
        var lines = codeblock.text().split("\n");
        var indent = Infinity, regex = /^(\s+)(.*)/;
        $.each(lines, function(j, line) {
          var space = regex.exec(line)[1];
          if (space) {
            indent = Math.min(indent, space.length);
          }
        });
        // now that we found the smallest indent, reassemble the lines
        var newblock = "";
        $.each(lines, function(n, line) {
          newblock += line.slice(indent) + "\n";
        });
        codeblock.text(newblock);


        // if this is a textarea just use the codemirror shorthand.
        if (codeblock.get(0).nodeName.toUpperCase() === "TEXTAREA") {
          editor = CodeMirror.fromTextArea(codeblock[0], options);
        } else {
          // else codemirror the element's content and attach to element parent. 
          var parent  = codeblock.parent();
          codeblock.hide();
          editor      = CodeMirror(parent[0], 
            $.extend(options, {
              value : codeblock.html()
            })
          );
        }

        // mark that this code block has been codemirrored.
        $.data(codeblock[0], cmconfig.data.codemirrorified, 'true');

        // attach a listener to this event to make sure that all other keybindings
        // don't trigger on keypress.
        $(editor.getWrapperElement()).keydown(function(e) {
          e.stopPropagation();
        });

        if (cmconfig.codemirror.runnable || codeblock.attr("runnable") === "true") {
          // make the code runnable
          var wrapper = editor.getWrapperElement(),
              button  = $('<div>', {
                "class" : "button",
                text : "Run"
              }).prependTo(wrapper),
              clearButton  = $('<div>', {
                "class" : "button clear",
                text : "Clear"
              }).prependTo(wrapper),
              output = $('<div>', {
                "class" : cmconfig.classes.codemirrorresult
              }).appendTo($(wrapper).parent());

          clearButton.click(function(editor, output){
            return function(event) {
              output.html('');
            };
          }(editor, output));

          button.click(function(editor, output){
            return function(event) {

              // save the default logging behavior.
              var real_console_log = console.log;
              
              // save the default logging behavior.
              // Following Dean Edward's fantastic sandbox code:
              // http://dean.edwards.name/weblog/2006/11/sandbox/+evaluating+js+in+an+iframe
              // create an iframe sandbox for this element.
              var iframe = $("<iframe>")
                .css("display", "none")
                .appendTo($('body'));

              // Overwrite the default log behavior to pipe to an output element.

              // Overwrite the default log behavior to pipe to an output element.
              console.log = function() {
                var messages = [];
                // Convert all arguments to Strings (Objects will be JSONified).
                for (var i = 0; i < arguments.length; i++) {
                  var value = arguments[i];
                  messages.push(typeof(value) == 'object' ? JSON.stringify(value) : String(value));
                }
                var msg = messages.join(" ");
                if (output.html() !== "") {
                  output.append("<br />" + msg);
                } else {
                    output.html(msg);
                }
              };

              var sandBoxMarkup = "<script>"+
                "var MSIE/*@cc_on =1@*/;"+ // sniff
                "console={ log: parent.console.log };" +
                "parent.sandbox=MSIE?this:{eval:function(s){return eval(s)}}<\/script>";

              
              // expose globals to iframe
              $.each(cmconfig.globals, function(prop, val) {
                val = $.trim(val);
                iframe[0].contentWindow[val] = window[val];
              });
            

              // write a script into the <iframe> and create the sandbox
              frames[frames.length - 1].document.write(sandBoxMarkup);

              var combinedSource = "";

              // Prepend all setup scripts
              $.each(hiddenScripts, function() {
                if ($(codeblock).is(this.selector)) {
                  combinedSource += this.src + "\n";
                }
              });
              
              combinedSource += editor.getValue();
              
              // Append all cleanup scripts
              $.each(cleanupScripts, function() {
                if ($(codeblock).is(this.selector)) {
                  combinedSource = combinedSource + this.src + "\n";
                }
              });

              // eval in the sandbox.
              sandbox.eval(combinedSource);

              // get rid of the frame. New Frame for every context.
              iframe.remove();
              
              // set the old logging behavior back.
              console.log = real_console_log;
            }
          }(editor, output));
        }
      }
    })
  }

  codemirrorify(".codeblock");
}());