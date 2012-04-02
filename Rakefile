require 'fileutils'

desc "Deploy Miso website" 
task :deploy do
  msg = ENV['MSG'] || 'production update'
  if ENV['HIDE'].nil?
    hider = 'echo "real deploy"'
  else
    hider = 'mv index.html i.html'
  end
  
  process = [
    #Get us in the right DIR
    "cd #{File.dirname(__FILE__)}",

    #Build the website and copy to production
    "staticmatic build .",
    "cd production",
    "git checkout master",
    "cp -R ../site/ .",

    #hide the index page if specified
    hider,

    #Commit & push changes
    "git add -A",
    "git commit -m '#{msg}'",
    "git push",
    
    #Update the submodule on the parent but don't commit
    "cd ..",
    "git submodule -q foreach git pull -q origin master"
  ]

  `#{ process.join(' && ') }`
  # puts go.join(' && ')
end

