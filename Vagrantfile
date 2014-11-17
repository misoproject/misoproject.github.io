Vagrant.configure("2") do |config|
  config.vm.box = "precise64"
  config.vm.box_url = "http://files.vagrantup.com/precise64.box"
  config.vm.provision :shell, :inline => $BOOTSTRAP_SCRIPT # see below
end

$BOOTSTRAP_SCRIPT = <<EOF
  set -e # Stop on any error

  # --------------- SETTINGS ----------------
  # Other settings
  export DEBIAN_FRONTEND=noninteractive

  sudo apt-get update

  sudo apt-get install -y ruby1.9.1-full git make

  wget wget http://nodejs.org/dist/v0.10.33/node-v0.10.33-linux-x64.tar.gz -O node.tar.gz
  tar xvf node.tar.gz

  sudo mkdir -p /opt/joyent
  sudo mv node /opt/joyent/node-0.10
  sudo ln -s /opt/joyent/node-0.10/ /opt/joyent/node
  sudo chown -R vagrant /opt/joyent/node

  gem install bundler

  cd vagrant
  git submodule init
  git submodule update
  bundle install
  /opt/joyent/node/bin/npm install
EOF
