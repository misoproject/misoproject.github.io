require 'yaml'

module MisoHelper


  def api_section(file)
    @api = [] unless @api
    base = File.join(File.dirname(__FILE__), '..', 'other')
    data = YAML.load_file("#{base}/#{file}")
    @api << data
    partial('/partials/_api_section', 
            :locals => { :data => data })
  end

  def methods( method_array )
    method_array.map do |method|
      methods['params'] = [] unless method['params']

    partial('../partials/section', :locals => { 
      :section_name => name, 
      :tag => idify(name),
      :section_class => section_class,
      :section_content => '../partials/' + partial })
  end
  # ------
  # API Generators
  # ------

  # signature: ds.somecall(p1, p2, p3)
  # params: [{:name => 'p1', :type => 'string', :description => 'bla', :params => [](optional)}]
  # description : text
  # ret
  def api(signature, params=[], description=nil, ret=nil)
    snippet = %[<li><code class='signature'>#{signature}</code><div class="doc">]
    if (description)
      snippet +=%[
        <p>#{description}</p>
      ]
    end
    if (ret)
      snippet +=%[
        <h3>Returns</h3>
        <code>#{ret}</code>
      ]
    end
    if (params.length > 0)
      snippet += %[
        <h3>Parameters</h3><ul class="params">]
    
      params.each do |param|
        snippet += buildParam(param)
      end

  def params( params )
    $stdout.puts 'PLX'+params.length.to_s
    params.map do |param|
      partial('/partials/_api_param', 
              :locals => { :param => param })
      params( param['params'] ) if param['params']
    end.join('')
  end

  def hamlify( text )
    @staticmatic.generate_html_from_template_source(text)
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
  def toHTMLCodeBlock(partial, id=nil, options={})
    codeblockify({
      :mode => "text/html",
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
    name
      .downcase
      .gsub(/\s/,'-')
      .gsub(/[^A-z0-9-]+/,'')
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
    puts "Making code block " + full_path
    

    if (params[:code])
      # make a code block
      snippet = "<div class=\"codeblock\"><textarea #{id} #{classname} #{mode} #{globals} #{runnable} #{showConsole} #{buttons} #{autorun} #{callbacksClear} #{callbacksReset} #{callbacksRun}>\n"
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
