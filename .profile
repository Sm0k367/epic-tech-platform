# Persistent package paths — pip (--user), npm (-g), and local bins
export PATH="/workspace/.npm-global/bin:/workspace/.local/bin:$HOME/.local/bin:$PATH"
export PYTHONUSERBASE=/workspace/.local
export PIP_USER=1
export NPM_CONFIG_PREFIX=/workspace/.npm-global
export KORTIX_PERSISTENT_ROOT="${KORTIX_PERSISTENT_ROOT:-/persistent}"
export OPENCODE_STORAGE_BASE="${OPENCODE_STORAGE_BASE:-$KORTIX_PERSISTENT_ROOT/opencode}"
export OPENCODE_SHADOW_STORAGE_BASE="${OPENCODE_SHADOW_STORAGE_BASE:-$KORTIX_PERSISTENT_ROOT/opencode-shadow}"
export KORTIX_OPENCODE_ARCHIVE_DIR="${KORTIX_OPENCODE_ARCHIVE_DIR:-$KORTIX_PERSISTENT_ROOT/opencode-archive}"
export KORTIX_OPENCODE_CACHE_DIR="${KORTIX_OPENCODE_CACHE_DIR:-$KORTIX_PERSISTENT_ROOT/opencode-cache}"
export AUTH_JSON_PATH="${AUTH_JSON_PATH:-$OPENCODE_STORAGE_BASE/auth.json}"
export SECRET_FILE_PATH="${SECRET_FILE_PATH:-$KORTIX_PERSISTENT_ROOT/secrets/.secrets.json}"
export SALT_FILE_PATH="${SALT_FILE_PATH:-$KORTIX_PERSISTENT_ROOT/secrets/.salt}"
export ENCRYPTION_KEY_PATH="${ENCRYPTION_KEY_PATH:-$KORTIX_PERSISTENT_ROOT/secrets/.encryption-key}"
export LSS_DIR="${LSS_DIR:-$KORTIX_PERSISTENT_ROOT/lss}"
export XDG_DATA_HOME="${XDG_DATA_HOME:-$KORTIX_PERSISTENT_ROOT}"

# ── Source .bashrc for login shells ──
# Login shells (bash -l) only read .profile, not .bashrc. Source it
# explicitly so aliases, completions, and readline config are available
# in both login and non-login shells (PTY terminals, SSH sessions, etc.)
if [ -n "$BASH" ] && [ -f "$HOME/.bashrc" ] && [ -z "$_BASHRC_SOURCED" ]; then
  export _BASHRC_SOURCED=1
  . "$HOME/.bashrc"
fi

# ── Ensure background processes survive SSH disconnect ──
# When SSH drops, the kernel sends SIGHUP to the session. This trap
# disowns all background jobs (Cursor's code server) before bash exits,
# preventing them from receiving the fatal SIGHUP.
trap 'disown -a 2>/dev/null' HUP
