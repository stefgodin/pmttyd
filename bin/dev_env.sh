#!/bin/bash

BIN_DIR="$(dirname -- ${BASH_SOURCE[0]})"
PROJECT_ROOT="$BIN_DIR/.."
cd $PROJECT_ROOT

tmux new -d -s neovim
tmux send-keys -t neovim.0 "nvim" ENTER

tmux new -d -s devserver
tmux send-keys -t devserver.0 "cd bin && ./dev_server.sh" ENTER

tmux new -d -s cli
tmux send-keys -t cli.0 "cd bin" ENTER

xdg-open localhost:42069 &

tmux attach -t neovim
