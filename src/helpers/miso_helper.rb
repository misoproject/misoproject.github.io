module MisoHelper

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
  def toRunnableCodeBlock(partial)
    codeblockify({ :partial => partial, :runnable => true })
  end

  def toDisplayCodeBlock(partial)
    codeblockify({ :partial => partial, :runnable => false })
  end

  private
  def codeblockify(params)
    partial = params[:partial]
    runnable = params[:runnable]

    full_path = File.join(Dir.pwd, 'src', 'snippets', partial.index(".js").nil? ? partial + ".js" : partial)
    puts "Making code block " + full_path
    snippet = "<div class=\"codeblock\"><textarea class=\"code\" id=\"code\" runnable=\"#{runnable}\">\n"
    
    File.open(full_path, 'r') do |f|
      snippet += f.read
    end
    
    # surround existing snippet with proper tags
    snippet += "</textarea></div>"
    snippet
  end
end