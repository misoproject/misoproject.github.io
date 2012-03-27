module MisoHelper

  #nav builder
  def nav(current_section)
    @sub_nav = [] if @sub_nav.nil?
    @nav = [] if @nav.nil?

    $stdout.puts @nav
    partial('../partials/nav', :locals => {
      :sections => @nav,
      :current_section => current_section,
      :sub => @sub_nav
    })
  end

  #section helper
  def section(name, partial)
    @sub_nav = [] if @sub_nav.nil?
    @sub_nav << name

    partial('../partials/section', :locals => { 
      :section_name => name, 
      :tag => idify(name),
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
    snippet = %[<div class="api"><pre>#{signature}</pre>]
    if (params.length > 0)
      snippet += %[
        <div class="params">
        <h4>Params:</h4>]
    
      params.each do |param|
        snippet += buildParam(param)
      end

      snippet += "</div>"
    end
    if (ret)
      snippet +=%[
          <div class="returns">
            <h4>Returns:</h4>
            <code>#{ret}</code>
          </div>
      ]
    end
    if (description)
      snippet +=%[
          <div class='about'>
            <h4>Description:</h4>
            #{description}
          </div>
        </div>
      ]
    end
    snippet
  end

  def buildParam(param)
    p = "<li><span class='param'>" + param[:name] + "</span> - "

    if (param[:description])
      p += "<span class='desc'>" + param[:description] + "</span>"
    end

    if (param[:params])
      p += "<ul>"
      param[:params].each do |param|
        p += buildParam(param)
      end
      p += "</ul>"
    end

    p += "</li>"
  end

  # ------
  # Code Block Generators
  # ------

  # display only
  def toDisplayCodeBlock(partial, id=nil)
    codeblockify({ 
      :partial => partial, 
      :runnable => false, 
      :code => true, 
      :id => id, 
      :showConsole => false 
    })
  end
  
  # runnable with console
  def toRunnableCodeBlock(partial, id=nil)
    codeblockify({ 
      :partial => partial, 
      :runnable => true, 
      :code => true, 
      :id => id, 
      :showConsole => true, 
      :buttons => "run,reset,clear" 
    })
  end

  # runnable with no console
  def toVisualCodeBlock(partial, id=nil)
    codeblockify({ 
      :partial => partial, 
      :runnable => true, 
      :code => true, 
      :id => id, 
      :showConsole => false, 
      :buttons => "run,reset" 
    })
  end

  # setup script. no visible impact, but attaches to a codeblock. 
  def toSetupCodeBlock(partial, id) 
    codeblockify({ 
      :partial => partial, 
      :runnable => false, 
      :code => false, 
      :selector => id 
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
    partial   = params[:partial]
    runnable  = params[:runnable]
    id        = params[:id]      ? "id=\"#{params[:id].gsub('#','')}\"" : ""
    buttons   = params[:buttons] ? "buttons=\"#{params[:buttons]}\""    : ""

    full_path = File.join(Dir.pwd, 'src', 'snippets', partial.index(".js").nil? ? partial + ".js" : partial)
    puts "Making code block " + full_path
    

    if (params[:code])
      # make a code block
      snippet = "<div class=\"codeblock\"><textarea class=\"code\" #{id} runnable=\"#{runnable}\" showConsole=\"#{params[:showConsole]}\" #{buttons}>\n"
    else
      # make a pre/post script
      snippet = "<script type='codemirror' data-selector='#{params[:selector]}'>"
    end
    
    # read file into it.
    File.open(full_path, 'r') do |f|
      snippet += f.read
    end
    
    # surround existing snippet with proper tags
    if (params[:code])
      snippet += "</textarea></div>"
    else
      snippet += "</script></div>"
    end

    snippet
  end
end
