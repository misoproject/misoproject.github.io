module MisoHelper
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