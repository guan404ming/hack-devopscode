WIDTH=$(tput cols 2> /dev/null || echo 60)

print_boxed_string() {
  local string="$1"
  printf "┌%s┐\n" "$(printf "─%.0s" $(seq 1 $(($WIDTH-2))))"
  printf "│ %-*s│\n" $(($WIDTH-3)) "$string"
  printf "└%s┘\n" "$(printf "─%.0s" $(seq 1 $(($WIDTH-2))))"
}

echo_yellow() {
  local string="$1"
  printf "\e[33m%s\e[0m\n" "$string"
}

#! Sets up the environment for the project
print_boxed_string "SETTING UP ENVIRONMENT..."
# Update the package list to ensure we get the latest version of the packages
echo_yellow "$ apt-get update"
apt-get update
# Install the required packages
echo_yellow "$ apt-get install -y curl unzip gnupg"
apt-get install -y curl unzip gnupg

#! Install Fnm
print_boxed_string "INSTALLING FNM..."
# Install fnm
echo_yellow "$ curl -fsSL https://fnm.vercel.app/install | bash"
curl -fsSL https://fnm.vercel.app/install | bash
# Setup Fnm Path
echo_yellow "$ export PATH=\"/root/.local/share/fnm:\$PATH\""
export PATH="/root/.local/share/fnm:$PATH"
# Setup Node Path
echo_yellow "$ eval \"\`fnm env\`\""
eval "`fnm env`"
# Apply the changes to the current shell
echo_yellow "$ source /root/.bashrc"
source /root/.bashrc

#! Install Node.js & Yarn
print_boxed_string "INSTALLING NODE.JS & YARN..."
# Install Node.js v18.18.0
echo_yellow "$ fnm install v18.18.0"
fnm install v18.18.0
# Install Yarn
echo_yellow "$ corepack enable"
corepack enable

#! Install MongoDB
print_boxed_string "INSTALLING MONGODB..."
# Import the public key used by the package management system
echo_yellow "$ curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor"
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
# Create a list file for MongoDB
echo_yellow "$ echo \"deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse\" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list"
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
# Reload the local package database
echo_yellow "$ apt-get update"
apt-get update
# Install the MongoDB packages
echo_yellow "$ apt-get install -y mongodb-org"
apt-get install -y mongodb-org

#! Setup the project
print_boxed_string "SETTING UP PROJECT..."
# Go to the project directory
echo_yellow "$ cd /autograder/source"
cd /autograder/source
# Install the required packages
echo_yellow "$ yarn install"
yarn install
# Install Playwright Chromium
echo_yellow "$ yarn playwright install chromium"
yarn playwright install chromium
# Install Playwright Chromium dependencies
echo_yellow "$ yarn playwright install-deps chromium"
yarn playwright install-deps chromium
