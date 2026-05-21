
# Source .profile for SSH sessions (guard prevents infinite loop with .profile sourcing .bashrc)
if [ -f "$HOME/.profile" ] && [ -z "$_BASHRC_SOURCED" ]; then
  . "$HOME/.profile"
fi

# ── kortix-shell-defaults ──
# Common aliases
alias ll='ls -lAh --color=auto'
alias la='ls -A --color=auto'
alias l='ls -CF --color=auto'
alias ls='ls --color=auto'
alias grep='grep --color=auto'
alias ..='cd ..'
alias ...='cd ../..'

# Persistent package management — use these instead of raw apt/pip/npm
# pip install <pkg>      → auto-persists (PIP_USER=1 → /workspace/.local/)
# npm install -g <pkg>   → auto-persists (NPM_CONFIG_PREFIX → /workspace/.npm-global/)
# apt-persist <pkg>      → installs + saves to manifest (auto-restored on restart)

# Load readline config (case-insensitive completion, etc.)
[ -f "$HOME/.inputrc" ] && export INPUTRC="$HOME/.inputrc"

# Enable bash-completion if available
[ -f /usr/share/bash-completion/bash_completion ] && . /usr/share/bash-completion/bash_completion
[ -f /etc/bash_completion ] && . /etc/bash_completion
export PATH="$HOME/.local/bin:$PATH"
