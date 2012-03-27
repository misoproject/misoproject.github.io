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
      buttons : "run,clear",
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

    // Seek out and cache all hidden scripts
    $("script[type=codemirror]").each(function() {
      hiddenScripts.push({
        selector: $(this).data("selector"),
        src: this.innerHTML
      });
    });

    console.log(hiddenScripts);
    // Seek out and cache all cleanup scripts
    $("script[type=\"codemirror/cleanup\"]").each(function() {
      cleanupScripts.push({
        selector: $(this).data("selector"),
        src: this.innerHTML
      });
    });
    
    $.each(codeblocks, function(i, codeblock) {
      if (!$.data(codeblock, cmconfig.data.codemirrorified)) {
        
        // initialize defaults.
        var codeblock = $(codeblock),
            editor    = null,
            options   = $.extend({}, cmconfig.codemirror,
              {
                mode    : !!codeblock.attr('mode') ? codeblock.attr('mode') : cmconfig.codemirror.mode,
                theme   : !!codeblock.attr('theme') ? codeblock.attr('theme') : cmconfig.codemirror.theme,
                buttons : !!codeblock.attr('buttons') ? codeblock.attr('buttons') : cmconfig.codemirror.buttons,
                
                onFocus : function(e) {
                  inEditor = true;
                },
                
                onBlur : function(e) {
                  inEditor = false;
                },
                readOnly : codeblock.attr("runnable") === "false" ? true : false
              }
            );

        // are we showing the console?
        if (options.readOnly) {
          options.showConsole = false;
        } else {
          if (codeblock.attr("showConsole") !== "false") {
            options.showConsole = true;
          } else {
            options.showConsole = false;
          }
        } 
        
        // scan through the text and remove the min amount of spaces
        // so that the indentation is properly done.
        var lines = codeblock.text().split("\n");
        var indent = Infinity, regex = /^(\s+)(.*)/;
        $.each(lines, function(j, line) {
          
          var space = regex.exec(line);
          if (space) {
            space = space[1];
            indent = Math.min(indent, space.length);
          } else {
            indent = 0;
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

        if (options.runnable || codeblock.attr("runnable") === "true") {
          
           // make the code runnable
          var wrapper = editor.getWrapperElement(),
              buttons = {},
              output = null;

          if (options.showConsole) {
            output = $('<div>', {
              "class" : cmconfig.classes.codemirrorresult
            }).appendTo($(wrapper).parent());
          }
          
          // ======= add run button =======
          if (options.buttons.indexOf("run") > -1) {
            buttons.run  = $('<div>', {
              "class" : "button",
              text : "Run"
            }).prependTo(wrapper)
            .click(function(editor, output, options){
              return function(event) {
                
                // save the default logging behavior.
                // Following Dean Edward's fantastic sandbox code:
                // http://dean.edwards.name/weblog/2006/11/sandbox/+evaluating+js+in+an+iframe
                // create an iframe sandbox for this element.
                var iframe = $("<iframe>")
                  .css("display", "none")
                  .appendTo($('body'));

                // Overwrite the default log behavior to pipe to an output element.
                
                // save the default logging behavior.
                if (options.showConsole) {
                  var real_console_log = console.log;
                  
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
                }

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
                
                if (options.showConsole) {
                  // set the old logging behavior back.
                  console.log = real_console_log;
                }
              }
            }(editor, output, options));
          }

          // ======= add clear button =======
          if (options.buttons.indexOf("clear") > -1) {
            buttons.clear = $('<div>', {
              "class" : "button clear",
              text : "Clear",
            }).prependTo(wrapper)
            .click(function(editor, output){
              return function(event) {
                if (output !== null) {
                  output.html('');
                }
              };
            }(editor, output));
          }

          // ======= add reset button =======
          if (options.buttons.indexOf("reset") > -1) {
            buttons.reset = $('<div>', {
              "class" : "button reset",
              text : "Reset"
            }).prependTo(wrapper)
            .click(function(e){
              editor.setValue(codeblock.html());
            });

          }
        }
      }
    })
  
    window.__def.resolve();
  }
  window.__def = _.Deferred();
  codemirrorify(".codeblock");

}());