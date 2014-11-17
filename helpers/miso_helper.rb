require 'yaml'

module MisoHelper


  def api_section(file)
    base = File.join(File.dirname(__FILE__), '..', 'other')
    data = YAML.load_file("#{base}/#{file}")
    @api << data
    partial('/partials/_api_section',
            :locals => { :data => data })
  end

  def methods( name, method_array, instance = false )
    method_array.map do |method|
      partial('/partials/_api_methods',
              :locals => { :method => method, :object => name, :instance => instance })
    end.join('')
  end

  def params( params )
    params.map do |param|
      partial('/partials/_api_param',
              :locals => { :param => param })
      params( param['params'] ) if param['params']
    end.join('')
  end

  def hamlify( text )
    @staticmatic.generate_html_from_template_source(text)
  end

  def truncate( text, to )
    original_length = text.length
    text.slice(0, to) + (original_length > to ? "..." : '')
  end

  def inheritify( obj )
    obj.each do |section|
      if section['inherit']
        section['inherit'].each do |inherit|
          from = @api.find {|i| i['name'] === inherit }

          #Recurse if needed
          unless from['inherited']
            inheritify( [from] )
            from['inherited'] = true
          end

          unless section['inherited']
            section['inherited'] = true
            if from['instance_methods'] && section['instance_methods']
              section['instance_methods'] = section['instance_methods'].concat(
                from['instance_methods'].map do |method|
                method['override'] = from['name']
                method
                end
              )
            end

            if from['instance_properties'] && section['instance_properties']
              section['instance_properties'] = section['instance_properties'].concat(
                from['instance_properties'].map do |method|
                method['override'] = from['name']
                method
                end
              )
            end
          end

        end
      end
    end
  end

  # ------
  # Code Block Generators
  # ------

  # display only
  def toDisplayCodeBlock(partial, id=nil, options={})
    codeblockify({
      :partial => partial,
      :runnable => false,
      :code => true,
      :id => id,
      :showConsole => false
    }.merge(options))
  end

  # runnable with console
  def toRunnableCodeBlock(partial, id=nil, options={})
    codeblockify({
      :partial => partial,
      :runnable => true,
      :code => true,
      :id => id,
      :showConsole => true,
      :buttons => "run,reset,clear"
    }.merge(options))
  end

  # runnable with no console
  def toVisualCodeBlock(partial, id=nil, options={})
    codeblockify({
      :partial => partial,
      :runnable => true,
      :code => true,
      :id => id,
      :showConsole => false,
      :buttons => "run,reset"
    }.merge(options))
  end

  # def html block
  def toDisplayHTMLCodeBlock(partial, id=nil, options={})
    codeblockify({
      :mode => "ace/mode/html",
      :partial => partial,
      :runnable => false,
      :editable => false,
      :code => true,
      :id => id,
      :showConsole => false
    }.merge(options))
  end
  def toHTMLCodeBlock(partial, id=nil, options={})
    codeblockify({
      :mode => "ace/mode/html",
      :partial => partial,
      :runnable => false,
      :code => true,
      :id => id,
      :showConsole => false
    }.merge(options))
  end

  # setup script. no visible impact, but attaches to a codeblock.
  def toSetupCodeBlock(partial, id)
    codeblockify({
      :partial => partial,
      :runnable => false,
      :code => false,
      :selector => id,
      :blocktype => "setup"
    })
  end

  def toCleanupCodeBlock(partial, id)
    codeblockify({
      :partial => partial,
      :runnable => false,
      :code => false,
      :selector => id,
      :blocktype => "cleanup"
    })
  end

  private
  def idify( name )
    name = [name] unless name.class == Array
    name.reject! do |part|
      part.nil? || part.empty?
    end
    name.map do |part|
      part
        .downcase
        .gsub(/\s/,'-')
        .gsub(/[^A-z0-9-]+/,'')
    end.join('_')
  end

  def codeblockify(params)
    partial     = params[:partial]
    mode        = defined?(params[:mode]) ? "mode=\"#{params[:mode]}\"" : "mode=\"javascript\""
    runnable    = params[:runnable] ? "runnable=\"#{params[:runnable]}\""          : ""
    id          = params[:id]      ? "id=\"#{params[:id].gsub('#','')}\""          : ""
    buttons     = params[:buttons] ? "buttons=\"#{params[:buttons]}\""             : "buttons=\"none\""
    globals     = params[:globals] ? "globals=\"#{params[:globals]}\""             : ""
    runonload   = params[:runonload] ? "runonload=\"#{params[:runonload]}\""       : ""
    classname   = params[:classname] ? "class=\"#{params[:classname]}\""           : "class=\"code\""
    showConsole = defined?(params[:showConsole]) ? "showConsole=\"#{params[:showConsole]}\"" : "showConsole=false"
    sandbox     = defined?(params[:sandbox]) ? "sandbox=\"#{params[:sandbox]}\""   : ""
    autorun     = defined?(params[:autorun]) ? "autorun=\"#{params[:autorun]}\""   : ""
    callbacksClear  = defined?(params[:callbacksClear]) ? "callbacks-clear=\"#{params[:callbacksClear]}\""   : ""
    callbacksReset  = defined?(params[:callbacksReset]) ? "callbacks-reset=\"#{params[:callbacksReset]}\""   : ""
    callbacksRun    = defined?(params[:callbacksRun])   ? "callbacks-run=\"#{params[:callbacksRun]}\""   : ""

    full_path = File.join(Dir.pwd, 'src', 'snippets', partial.index(".js").nil? && partial.index(".html").nil? ? partial + ".js" : partial)

    if (params[:code])
      # make a code block
      snippet = "<div class=\"codeblock\"><textarea name=\"codehelper\" #{id} #{classname} #{mode} #{globals} #{runnable} #{showConsole} #{buttons} #{autorun} #{callbacksClear} #{callbacksReset} #{callbacksRun}>\n"
    else
      # make a pre/post script
      snippet = "<script type='codemirror/#{params[:blocktype]}' data-selector='#{params[:selector]}'>"
    end

    # read file into it.
    File.open(full_path, 'r') do |f|
      snippet += f.read
    end

    # surround existing snippet with proper tags
    if (params[:code] && params[:runnable])
      snippet += "</textarea><div class=\"helptext\">You can edit the code in this block and rerun it.</div></div>"
    elsif (params[:code] && !params[:runnable])
      snippet += "</textarea></div>"
    else
      snippet += "</script></div>"
    end

    snippet
  end
end
