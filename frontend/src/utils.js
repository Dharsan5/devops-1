const AVATAR_COLORS = [
  '#F97316', // orange (primary)
  '#8B5CF6', // purple
  '#06B6D4', // cyan
  '#10B981', // emerald
  '#F59E0B', // amber
  '#EC4899', // pink
  '#3B82F6', // blue
  '#EF4444', // red
];

export function getAvatarColor(username = '') {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function getInitials(username = '') {
  return username.slice(0, 2).toUpperCase() || '??';
}

export function formatTime(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString([], { month: 'long', day: 'numeric' });
}
