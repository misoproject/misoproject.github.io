require 'fileutils'

desc "Build a pano project for distribution" 
task :deploy do
  msg = ENV['MSG'] || 'production update'
  go = [
    "cd #{File.dirname(__FILE__)}",
    "cd production",
    "git co master",
    "cp -R ../site/ .",
    "git add -A",
    "git commit -m '#{msg}'",
    "git push",
    "cd ..",
    "git submodule -q foreach git pull -q origin master"
  ]
  `#{go.join(' && ')}`
  # puts go.join(' && ')
end

