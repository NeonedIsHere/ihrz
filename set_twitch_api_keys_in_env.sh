#!/bin/bash

# Prompt the user for the keys
read -p "Enter your TWITCH_APPLICATION_ID: " TWITCH_APPLICATION_ID
read -p "Enter your TWITCH_APPLICATION_SECRET: " TWITCH_APPLICATION_SECRET

# Detect if the user is using Bash or Zsh
SHELL_CONFIG=""
if [ -n "$BASH_VERSION" ]; then
    SHELL_CONFIG="$HOME/.bashrc"
elif [ -n "$ZSH_VERSION" ]; then
    SHELL_CONFIG="$HOME/.zshrc"
else
    echo "Unsupported shell. Please add the variables manually to your shell configuration file."
    exit 1
fi

# Add the environment variables to the shell configuration file
echo "export TWITCH_APPLICATION_ID=\"$TWITCH_APPLICATION_ID\"" >> $SHELL_CONFIG
echo "export TWITCH_APPLICATION_SECRET=\"$TWITCH_APPLICATION_SECRET\"" >> $SHELL_CONFIG

# Reload the shell configuration
source $SHELL_CONFIG

echo "TWITCH_APPLICATION_ID and TWITCH_APPLICATION_SECRET have been added to $SHELL_CONFIG and reloaded."