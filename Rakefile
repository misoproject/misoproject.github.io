require 'fileutils'

desc "Deploy Miso website" 
task :deploy do
  msg = ENV['MSG'] || 'production update'
  if ENV['HIDE'].nil?
    hider = 'echo "real deploy"'
  else
    hider = 'mv index.html i.html'
  end

  rootdir = File.dirname(__FILE__)
  
  process = [
    # Get us in the right DIR
    "cd #{rootdir}",

    # Build the website and copy to production
    "staticmatic build .",

    # go into temp directory and checkout the repo for ghpages.
    "cd /tmp",
    "git clone git@github.com:misoproject/misoproject.github.com",
    "cd misoproject.github.com",
    "git checkout master",
    
    "cp -R #{rootdir}/site/ .",

    # #hide the index page if specified
    hider,

    # #Commit & push changes
    "git add -A",
    "git commit -m '#{msg}'",
    "git push",
    
    # remove dir
    "rm -rf /tmp/misoproject.github.com",

    # #Update the submodule on the parent but don't commit
    "cd #{rootdir}",
    "git submodule -q foreach git pull -q origin master"
  ]

  `#{ process.join(' && ') }`
  # puts go.join(' && ')
end

