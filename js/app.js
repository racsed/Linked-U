// ============================================================
// LINKED.U - app.js
// Application logic - Vanilla JS
// ============================================================

const App = {
  // --------------- State ---------------
  posts: Storage.get('posts', DEFAULT_POSTS),
  messages: Storage.get('messages', DEFAULT_MESSAGES),
  connections: Storage.get('connections', NETWORK_USERS),
  notifications: Storage.get('notifications', NOTIFICATIONS),
  candidatures: Storage.get('candidatures', DEFAULT_CANDIDATURES),
  events: Storage.get('events', DEFAULT_EVENTS),
  mentors: DEFAULT_MENTORS,
  stages: DEFAULT_STAGES,
  resources: Storage.get('resources', DEFAULT_RESOURCES),
  theme: Storage.get('theme', 'light'),
  activeConversation: null,
  activeView: 'feed',
  searchTimeout: null,
  chatbotOpen: false,
  accessibilityMode: Storage.get('accessibility', false),

  // --------------- Init ---------------
  init() {
    this.applyTheme();
    this.renderFeed();
    this.renderStages();
    this.renderResources();
    this.renderMessages();
    this.renderNetwork();
    this.renderNotifications();
    this.renderBadges();
    this.renderProfileStats();
    this.attachEventListeners();
    this.initScrollToTop();
    this.initAnimatedCounters();
    this.initProgressBars();
    this.initNavScroll();
    this.initAccessibility();
    console.log('LINKED.U App initialized');
  },

  // ====================================================================
  // THEME
  // ====================================================================
  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
    const btn = document.querySelector('[data-action="toggle-theme"]');
    if (btn) {
      const icon = btn.querySelector('i') || btn;
      icon.className = this.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  },

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    Storage.set('theme', this.theme);
    this.applyTheme();
    this.showToast(this.theme === 'dark' ? 'Mode sombre active' : 'Mode clair active');
  },

  // ====================================================================
  // TOAST
  // ====================================================================
  showToast(message, duration = 3000) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'nexta-toast';
    toast.style.cssText = 'background:#1e293b;color:#fff;padding:12px 20px;border-radius:10px;font-size:0.9rem;box-shadow:0 4px 20px rgba(0,0,0,.15);opacity:0;transform:translateY(10px);transition:all .3s ease;max-width:320px;';
    toast.textContent = message;
    container.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  // ====================================================================
  // FEED / POSTS
  // ====================================================================
  renderFeed() {
    const container = document.getElementById('feed-posts') || document.querySelector('.feed-posts');
    if (!container) return;
    container.innerHTML = this.posts.map(post => this.renderPost(post)).join('');
  },

  renderPost(post) {
    const user = getUserById(post.userId);
    if (!user) return '';
    const timeAgo = this.timeAgo(post.timestamp);
    const avatarStyle = user.color.includes('gradient')
      ? `background:${user.color};`
      : `background:${user.color};`;
    const likedClass = post.liked ? 'liked' : '';
    const bookmarkedClass = post.bookmarked ? 'bookmarked' : '';

    return `
      <article class="post-card" data-post-id="${post.id}">
        <div class="post-header">
          <div class="post-avatar clickable-avatar" style="${avatarStyle}" data-action="view-user" data-user-id="${post.userId}">${user.initials}</div>
          <div class="post-meta">
            <h4 class="post-author clickable-user" data-action="view-user" data-user-id="${post.userId}">${user.fullName}</h4>
            <span class="post-info">${user.classe || ''} ${user.filiere ? '- ' + user.filiere : ''}</span>
            <span class="post-time">${timeAgo}</span>
          </div>
          <button class="post-menu-btn" data-action="post-menu" data-post-id="${post.id}">
            <i class="fas fa-ellipsis-h"></i>
          </button>
        </div>
        <div class="post-content">${post.content}</div>
        <div class="post-stats">
          <span class="post-likes-count"><i class="fas fa-heart"></i> ${post.likes}</span>
          <span class="post-comments-count">${post.comments.length} commentaire${post.comments.length !== 1 ? 's' : ''}</span>
        </div>
        <div class="post-actions">
          <button class="post-action-btn ${likedClass}" data-action="like" data-post-id="${post.id}">
            <i class="${post.liked ? 'fas' : 'far'} fa-heart"></i>
            <span>${post.liked ? 'Aime' : 'Aimer'}</span>
          </button>
          <button class="post-action-btn" data-action="comment" data-post-id="${post.id}">
            <i class="far fa-comment"></i>
            <span>Commenter</span>
          </button>
          <button class="post-action-btn" data-action="share" data-post-id="${post.id}">
            <i class="far fa-share-square"></i>
            <span>Partager</span>
          </button>
          <button class="post-action-btn ${bookmarkedClass}" data-action="bookmark" data-post-id="${post.id}">
            <i class="${post.bookmarked ? 'fas' : 'far'} fa-bookmark"></i>
          </button>
        </div>
        <div class="post-comments-section" id="comments-${post.id}" style="display:none;">
          <div class="comments-list">
            ${post.comments.map(c => this.renderComment(c)).join('')}
          </div>
          <div class="comment-input-wrapper">
            <div class="comment-avatar" style="background:${CURRENT_USER.color}">${CURRENT_USER.initials}</div>
            <input type="text" class="comment-input" placeholder="Ecrire un commentaire..." data-post-id="${post.id}">
            <button class="comment-send-btn" data-action="send-comment" data-post-id="${post.id}">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </article>
    `;
  },

  renderComment(comment) {
    const user = getUserById(comment.userId);
    if (!user) return '';
    return `
      <div class="comment-item">
        <div class="comment-avatar-small" style="background:${user.color}">${user.initials}</div>
        <div class="comment-body">
          <span class="comment-author">${user.fullName}</span>
          <p class="comment-text">${comment.text}</p>
          <span class="comment-time">${this.timeAgo(comment.timestamp)}</span>
        </div>
      </div>
    `;
  },

  createPost(content) {
    if (!content || !content.trim()) return;
    const newPost = {
      id: 'post_' + Date.now(),
      userId: 'user_amira',
      content: '<p>' + content.replace(/\n/g, '</p><p>') + '</p>',
      likes: 0,
      liked: false,
      bookmarked: false,
      comments: [],
      timestamp: new Date().toISOString()
    };
    this.posts.unshift(newPost);
    Storage.set('posts', this.posts);
    this.renderFeed();
    this.showToast('Publication creee');
  },

  toggleLike(postId) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
    Storage.set('posts', this.posts);

    const card = document.querySelector(`[data-post-id="${postId}"].post-card`) ||
                 document.querySelector(`.post-card[data-post-id="${postId}"]`);
    if (card) {
      const btn = card.querySelector('[data-action="like"]');
      const icon = btn.querySelector('i');
      const label = btn.querySelector('span');
      const countEl = card.querySelector('.post-likes-count');

      btn.classList.toggle('liked', post.liked);
      icon.className = (post.liked ? 'fas' : 'far') + ' fa-heart';
      label.textContent = post.liked ? 'Aime' : 'Aimer';
      countEl.innerHTML = `<i class="fas fa-heart"></i> ${post.likes}`;

      // Animate
      icon.style.transform = 'scale(1.3)';
      setTimeout(() => { icon.style.transform = 'scale(1)'; }, 200);
    }
  },

  toggleComments(postId) {
    const section = document.getElementById('comments-' + postId);
    if (!section) return;
    const isHidden = section.style.display === 'none';
    section.style.display = isHidden ? 'block' : 'none';
    if (isHidden) {
      const input = section.querySelector('.comment-input');
      if (input) input.focus();
    }
  },

  addComment(postId, text) {
    if (!text || !text.trim()) return;
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;
    const comment = {
      id: 'c_' + Date.now(),
      userId: 'user_amira',
      text: text.trim(),
      timestamp: new Date().toISOString()
    };
    post.comments.push(comment);
    Storage.set('posts', this.posts);

    // Update UI
    const section = document.getElementById('comments-' + postId);
    if (section) {
      const list = section.querySelector('.comments-list');
      list.insertAdjacentHTML('beforeend', this.renderComment(comment));
      const input = section.querySelector('.comment-input');
      if (input) input.value = '';
    }
    // Update count
    const card = document.querySelector(`.post-card[data-post-id="${postId}"]`);
    if (card) {
      const countEl = card.querySelector('.post-comments-count');
      if (countEl) countEl.textContent = `${post.comments.length} commentaire${post.comments.length !== 1 ? 's' : ''}`;
    }
    this.showToast('Commentaire ajoute');
  },

  toggleBookmark(postId) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;
    post.bookmarked = !post.bookmarked;
    Storage.set('posts', this.posts);

    const card = document.querySelector(`.post-card[data-post-id="${postId}"]`);
    if (card) {
      const btn = card.querySelector('[data-action="bookmark"]');
      const icon = btn.querySelector('i');
      btn.classList.toggle('bookmarked', post.bookmarked);
      icon.className = (post.bookmarked ? 'fas' : 'far') + ' fa-bookmark';
    }
    this.showToast(post.bookmarked ? 'Publication enregistree' : 'Publication retiree des favoris');
  },

  sharePost(postId) {
    const url = window.location.href.split('#')[0] + '#post-' + postId;
    if (navigator.share) {
      navigator.share({
        title: 'LINKED.U - Publication',
        text: 'Decouvre cette publication sur LINKED.U !',
        url: url
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        this.showToast('Lien copie dans le presse-papiers');
      }).catch(() => {
        this.showToast('Impossible de copier le lien');
      });
    }
  },

  // ====================================================================
  // STAGES
  // ====================================================================
  renderStages(filter = 'all') {
    const container = document.getElementById('stages-list') || document.querySelector('.stages-list');
    if (!container) return;
    const filtered = filter === 'all' ? this.stages : this.stages.filter(s => s.category === filter);
    if (filtered.length === 0) {
      container.innerHTML = '<div class="empty-state"><i class="fas fa-briefcase"></i><p>Aucun stage trouve pour cette categorie</p></div>';
      return;
    }
    container.innerHTML = filtered.map(stage => this.renderStageCard(stage)).join('');
    // Animate cards
    container.querySelectorAll('.stage-card').forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(10px)';
      setTimeout(() => {
        card.style.transition = 'all .3s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, i * 80);
    });
  },

  renderStageCard(stage) {
    return `
      <div class="stage-card" data-stage-id="${stage.id}" data-category="${stage.category}">
        <div class="stage-icon" style="background:${stage.iconBg};color:${stage.iconColor};">
          <i class="${stage.icon}"></i>
        </div>
        <div class="stage-info">
          <h4 class="stage-title">${stage.title}</h4>
          <p class="stage-company">${stage.company}</p>
          <div class="stage-details">
            <span><i class="fas fa-map-marker-alt"></i> ${stage.location}</span>
            <span><i class="fas fa-clock"></i> ${stage.duration}</span>
            <span><i class="fas fa-graduation-cap"></i> ${stage.level}</span>
            ${stage.mode !== 'Presentiel' ? `<span class="stage-mode"><i class="fas fa-laptop"></i> ${stage.mode}</span>` : ''}
            ${stage.isAlternance ? '<span class="stage-alternance"><i class="fas fa-sync-alt"></i> Alternance</span>' : ''}
          </div>
          <div class="stage-tags">
            ${stage.tags.map(t => `<span class="tag">${t}</span>`).join('')}
          </div>
        </div>
        <button class="stage-apply-btn" data-action="apply-stage" data-stage-id="${stage.id}">
          Postuler <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    `;
  },

  filterStages(category) {
    // Update active chip
    document.querySelectorAll('[data-filter-stage]').forEach(chip => {
      chip.classList.toggle('active', chip.dataset.filterStage === category);
    });
    this.renderStages(category);
  },

  // ====================================================================
  // RESOURCES
  // ====================================================================
  renderResources(filter = 'all') {
    const container = document.getElementById('resources-list') || document.querySelector('.resources-list');
    if (!container) return;
    const filtered = filter === 'all' ? this.resources : this.resources.filter(r => r.category === filter);
    if (filtered.length === 0) {
      container.innerHTML = '<div class="empty-state"><i class="fas fa-folder-open"></i><p>Aucune ressource trouvee pour cette categorie</p></div>';
      return;
    }
    container.innerHTML = filtered.map(res => this.renderResourceCard(res)).join('');
    // Animate
    container.querySelectorAll('.resource-card').forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(10px)';
      setTimeout(() => {
        card.style.transition = 'all .3s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, i * 80);
    });
  },

  renderResourceCard(res) {
    const user = getUserById(res.userId);
    return `
      <div class="resource-card" data-resource-id="${res.id}" data-category="${res.category}">
        <div class="resource-type" style="color:${res.typeColor}">
          <i class="${res.typeIcon}"></i>
          <span>${res.typeLabel}</span>
        </div>
        <h4 class="resource-title">${res.title}</h4>
        <p class="resource-desc">${res.description}</p>
        <div class="resource-author">
          <div class="resource-author-avatar" style="background:${user ? user.color : '#ccc'}">${user ? user.initials : '?'}</div>
          <span>${user ? user.fullName : 'Inconnu'}</span>
        </div>
        <div class="resource-stats">
          <span class="resource-stat-btn" data-action="download-resource" data-resource-id="${res.id}" style="cursor:pointer"><i class="fas fa-download"></i> ${res.downloads}</span>
          <span class="resource-stat-btn" data-action="like-resource" data-resource-id="${res.id}" style="cursor:pointer"><i class="fas fa-heart"></i> ${res.likes}</span>
          <span><i class="fas fa-comment"></i> ${res.comments}</span>
        </div>
        <div class="resource-tags">
          ${res.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      </div>
    `;
  },

  likeResource(resourceId) {
    const res = this.resources.find(r => r.id === resourceId);
    if (!res) return;
    res.likes += 1;
    Storage.set('resources', this.resources);
    this.renderResources(document.querySelector('[data-filter-resource].active')?.dataset.filterResource || 'all');
    this.showToast('Ressource aimee');
  },

  downloadResource(resourceId) {
    const res = this.resources.find(r => r.id === resourceId);
    if (!res) return;
    res.downloads += 1;
    Storage.set('resources', this.resources);
    this.renderResources(document.querySelector('[data-filter-resource].active')?.dataset.filterResource || 'all');
    this.showToast('Ressource telechargee');
  },

  filterResources(category) {
    document.querySelectorAll('[data-filter-resource]').forEach(chip => {
      chip.classList.toggle('active', chip.dataset.filterResource === category);
    });
    this.renderResources(category);
  },

  // ====================================================================
  // MESSAGES
  // ====================================================================
  renderMessages() {
    const listContainer = document.getElementById('conversations-list') || document.querySelector('.conversations-list');
    if (!listContainer) return;
    if (this.messages.length === 0) {
      listContainer.innerHTML = '<div class="empty-state"><i class="fas fa-comments"></i><p>Aucune conversation pour le moment</p></div>';
      return;
    }
    listContainer.innerHTML = this.messages.map(conv => this.renderConversationItem(conv)).join('');
    // Auto-open first conversation
    if (this.messages.length > 0 && !this.activeConversation) {
      this.openConversation(this.messages[0].id);
    }
  },

  renderConversationItem(conv) {
    const user = getUserById(conv.userId);
    if (!user) return '';
    const isActive = this.activeConversation === conv.id;
    const time = this.timeShort(conv.lastTimestamp);
    return `
      <div class="conversation-item ${isActive ? 'active' : ''} ${conv.unread > 0 ? 'unread' : ''}" data-action="open-conversation" data-conv-id="${conv.id}">
        <div class="conv-avatar" style="background:${user.color}">${user.initials}</div>
        <div class="conv-preview">
          <div class="conv-header">
            <span class="conv-name">${user.fullName}</span>
            <span class="conv-time">${time}</span>
          </div>
          <p class="conv-last-msg">${conv.lastMessage}</p>
        </div>
        ${conv.unread > 0 ? `<span class="conv-unread-badge">${conv.unread}</span>` : ''}
      </div>
    `;
  },

  openConversation(convId) {
    this.activeConversation = convId;
    const conv = this.messages.find(c => c.id === convId);
    if (!conv) return;

    // Mark as read
    conv.unread = 0;
    Storage.set('messages', this.messages);

    // Update list active state
    document.querySelectorAll('.conversation-item').forEach(el => {
      el.classList.toggle('active', el.dataset.convId === convId);
      if (el.dataset.convId === convId) el.classList.remove('unread');
    });
    const badge = document.querySelector(`.conversation-item[data-conv-id="${convId}"] .conv-unread-badge`);
    if (badge) badge.remove();

    // Render chat
    const chatContainer = document.getElementById('chat-messages') || document.querySelector('.chat-messages');
    const chatHeader = document.getElementById('chat-header') || document.querySelector('.chat-header');
    if (!chatContainer) return;

    const user = getUserById(conv.userId);
    if (chatHeader && user) {
      chatHeader.innerHTML = `
        <div class="chat-header-info">
          <div class="chat-header-avatar" style="background:${user.color}">${user.initials}</div>
          <div>
            <h4>${user.fullName}</h4>
            <span class="chat-status">En ligne</span>
          </div>
        </div>
      `;
    }

    chatContainer.innerHTML = conv.messages.map(msg => {
      const isMe = msg.from === 'user_amira';
      const sender = getUserById(msg.from);
      return `
        <div class="chat-message ${isMe ? 'sent' : 'received'}">
          ${!isMe && sender ? `<div class="msg-avatar" style="background:${sender.color}">${sender.initials}</div>` : ''}
          <div class="msg-bubble">
            <p>${msg.text}</p>
            <span class="msg-time">${this.timeShort(msg.timestamp)}</span>
          </div>
        </div>
      `;
    }).join('');

    // Scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
  },

  sendMessage(convId, text) {
    if (!text || !text.trim()) return;
    const conv = this.messages.find(c => c.id === convId);
    if (!conv) return;

    const msg = {
      id: 'm_' + Date.now(),
      from: 'user_amira',
      text: text.trim(),
      timestamp: new Date().toISOString()
    };
    conv.messages.push(msg);
    conv.lastMessage = text.trim();
    conv.lastTimestamp = msg.timestamp;

    Storage.set('messages', this.messages);

    // Append to chat
    const chatContainer = document.getElementById('chat-messages') || document.querySelector('.chat-messages');
    if (chatContainer) {
      chatContainer.insertAdjacentHTML('beforeend', `
        <div class="chat-message sent">
          <div class="msg-bubble">
            <p>${msg.text}</p>
            <span class="msg-time">${this.timeShort(msg.timestamp)}</span>
          </div>
        </div>
      `);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Update preview in list
    this.renderMessages();
    this.showToast('Message envoye');
  },

  // ====================================================================
  // NETWORK
  // ====================================================================
  renderNetwork() {
    const container = document.getElementById('network-list') || document.querySelector('.network-list');
    if (!container) return;
    container.innerHTML = this.connections.map(conn => {
      const user = getUserById(conn.id);
      if (!user) return '';
      return `
        <div class="network-card" data-user-id="${conn.id}">
          <div class="network-avatar clickable-avatar" style="background:${user.color}" data-action="view-user" data-user-id="${conn.id}">${user.initials}</div>
          <h4 class="network-name clickable-user" data-action="view-user" data-user-id="${conn.id}">${user.fullName}</h4>
          <p class="network-info">${user.classe || ''} ${user.filiere ? '- ' + user.filiere : ''}</p>
          <p class="network-mutual">${conn.mutualConnections} connexion${conn.mutualConnections > 1 ? 's' : ''} en commun</p>
          <button class="network-btn ${conn.connected ? 'connected' : ''}" data-action="toggle-connection" data-user-id="${conn.id}">
            ${conn.connected ? '<i class="fas fa-check"></i> Connecte' : '<i class="fas fa-user-plus"></i> Se connecter'}
          </button>
        </div>
      `;
    }).join('');
  },

  toggleConnection(userId) {
    const conn = this.connections.find(c => c.id === userId);
    if (!conn) return;
    conn.connected = !conn.connected;
    Storage.set('connections', this.connections);

    const card = document.querySelector(`.network-card[data-user-id="${userId}"]`);
    if (card) {
      const btn = card.querySelector('.network-btn');
      btn.classList.toggle('connected', conn.connected);
      btn.innerHTML = conn.connected
        ? '<i class="fas fa-check"></i> Connecte'
        : '<i class="fas fa-user-plus"></i> Se connecter';
    }
    this.showToast(conn.connected ? 'Connexion ajoutee' : 'Connexion retiree');
    this.renderProfileStats();
  },

  // ====================================================================
  // NOTIFICATIONS
  // ====================================================================
  renderNotifications() {
    const panel = document.getElementById('notifications-panel') || document.querySelector('.notifications-panel');
    if (!panel) return;
    const list = panel.querySelector('.notifications-list') || panel;
    list.innerHTML = this.notifications.map(notif => `
      <div class="notification-item ${notif.read ? '' : 'unread'}" data-action="read-notification" data-notif-id="${notif.id}">
        <div class="notif-icon" style="background:${notif.iconBg};color:${notif.iconColor}">
          <i class="${notif.icon}"></i>
        </div>
        <div class="notif-content">
          <p class="notif-title">${notif.title}</p>
          <p class="notif-message">${notif.message}</p>
          <span class="notif-time">${this.timeAgo(notif.timestamp)}</span>
        </div>
        ${!notif.read ? '<span class="notif-dot"></span>' : ''}
      </div>
    `).join('');

    this.updateNotificationBadge();
  },

  updateNotificationBadge() {
    const count = this.notifications.filter(n => !n.read).length;
    const badge = document.getElementById('notif-badge') || document.querySelector('.notif-badge');
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  },

  toggleNotificationsPanel() {
    const panel = document.getElementById('notifications-panel') || document.querySelector('.notifications-panel');
    if (!panel) return;
    panel.classList.toggle('open');
  },

  markNotificationRead(notifId) {
    const notif = this.notifications.find(n => n.id === notifId);
    if (!notif || notif.read) return;
    notif.read = true;
    Storage.set('notifications', this.notifications);
    this.renderNotifications();
  },

  // ====================================================================
  // BADGES
  // ====================================================================
  renderBadges() {
    const container = document.getElementById('badges-list') || document.querySelector('.badges-list');
    if (!container) return;
    container.innerHTML = BADGES.map(badge => `
      <div class="badge-card ${badge.earned ? 'earned' : 'locked'}">
        <div class="badge-icon" style="background:${badge.earned ? badge.color : '#94a3b8'}20;color:${badge.earned ? badge.color : '#94a3b8'}">
          <i class="${badge.icon}"></i>
        </div>
        <h4 class="badge-title">${badge.title}</h4>
        <p class="badge-desc">${badge.description}</p>
        ${badge.earned ? `<span class="badge-date">Obtenu le ${this.formatDate(badge.earnedDate)}</span>` : '<span class="badge-locked"><i class="fas fa-lock"></i> Non debloque</span>'}
      </div>
    `).join('');
  },

  // ====================================================================
  // VIEW OTHER USER PROFILE
  // ====================================================================
  viewUserProfile(userId) {
    const user = getUserById(userId);
    if (!user) return;
    // Save current view to go back
    this._previousView = this.activeView;
    const mainContent = document.getElementById('main-content') || document.querySelector('.main-content');
    if (!mainContent) return;
    const skills = user.skills || [];
    mainContent.innerHTML = `
      <div class="user-profile-view" style="animation:fadeInUp .3s ease">
        <button class="back-btn" data-action="go-back" style="display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:var(--radius-sm);border:1.5px solid var(--border);background:var(--surface);cursor:pointer;font-family:var(--font);font-size:14px;font-weight:600;color:var(--ink-2);margin-bottom:24px;transition:all .2s">
          <i class="fas fa-arrow-left"></i> Retour
        </button>
        <div style="background:var(--surface);border:1.5px solid var(--border);border-radius:var(--radius-lg);overflow:hidden">
          <div style="height:120px;background:var(--grad-hero)"></div>
          <div style="padding:0 32px 32px;margin-top:-40px">
            <div style="width:80px;height:80px;border-radius:50%;background:${user.color};display:grid;place-items:center;font-size:28px;font-weight:800;color:#fff;border:4px solid var(--surface);margin-bottom:16px">${user.initials}</div>
            <h2 style="font-size:22px;font-weight:800;margin-bottom:4px">${user.fullName}</h2>
            <p style="color:var(--ink-2);font-size:14px;margin-bottom:4px">${user.classe || ''} ${user.filiere ? '- ' + user.filiere : ''}</p>
            <p style="color:var(--ink-3);font-size:13px;margin-bottom:16px">${user.lycee || ''}</p>
            ${user.bio ? `<p style="font-size:14px;line-height:1.7;color:var(--ink);margin-bottom:20px">${user.bio}</p>` : ''}
            ${skills.length ? `
              <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:20px">
                ${skills.map(s => `<span style="padding:6px 14px;border-radius:20px;background:var(--electric-light);color:var(--electric);font-size:12px;font-weight:600">${s}</span>`).join('')}
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  },

  goBack() {
    if (this._previousView) {
      this.switchView(this._previousView);
    }
  },

  // ====================================================================
  // PROFILE
  // ====================================================================
  renderProfileStats() {
    const connCount = this.connections.filter(c => c.connected).length;
    const els = {
      connections: document.querySelector('[data-stat="connections"]'),
      posts: document.querySelector('[data-stat="posts"]'),
      views: document.querySelector('[data-stat="views"]')
    };
    if (els.connections) els.connections.textContent = CURRENT_USER.connections + connCount;
    if (els.posts) els.posts.textContent = CURRENT_USER.posts + this.posts.filter(p => p.userId === 'user_amira').length;
    if (els.views) els.views.textContent = CURRENT_USER.views;
  },

  openProfileEdit() {
    const modal = document.getElementById('profile-edit-modal');
    if (!modal) return;
    // Populate form with saved or default values
    const profile = Storage.get('profile', {
      bio: CURRENT_USER.bio,
      headline: CURRENT_USER.headline,
      skills: CURRENT_USER.skills.join(', ')
    });
    const nameInput = document.getElementById('edit-name');
    const headlineInput = document.getElementById('edit-headline');
    const bioInput = document.getElementById('edit-bio');
    const tagsInput = document.getElementById('edit-tags');
    if (nameInput) nameInput.value = CURRENT_USER.fullName;
    if (headlineInput) headlineInput.value = profile.headline;
    if (bioInput) bioInput.value = profile.bio;
    if (tagsInput) tagsInput.value = profile.skills;
    modal.classList.add('open');
  },

  saveProfile() {
    const headline = document.getElementById('edit-headline');
    const bio = document.getElementById('edit-bio');
    const skills = document.getElementById('edit-tags');
    if (!headline || !bio || !skills) return;

    const profile = {
      headline: headline.value.trim(),
      bio: bio.value.trim(),
      skills: skills.value.trim()
    };
    Storage.set('profile', profile);

    // Update visible elements (using IDs from HTML)
    const headlineEl = document.getElementById('profile-headline') || document.querySelector('.headline');
    const bioEl = document.getElementById('profile-bio') || document.querySelector('.bio');
    const tagsEl = document.getElementById('profile-tags') || document.querySelector('.profile-tags');
    if (headlineEl) headlineEl.textContent = profile.headline;
    if (bioEl) bioEl.textContent = profile.bio;
    if (tagsEl) {
      tagsEl.innerHTML = profile.skills.split(',').map(s => {
        const trimmed = s.trim();
        return `<span class="tag tag-blue">${trimmed}</span>`;
      }).join('');
    }

    this.closeModal();
    this.showToast('Profil mis a jour');
  },

  closeModal() {
    document.querySelectorAll('.modal-overlay.open').forEach(modal => {
      modal.classList.remove('open');
    });
  },

  // ====================================================================
  // SEARCH
  // ====================================================================
  handleSearch(query) {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.performSearch(query);
    }, 300);
  },

  performSearch(query) {
    const panel = document.getElementById('search-results') || document.querySelector('.search-results');
    if (!panel) return;

    if (!query || query.trim().length < 2) {
      panel.style.display = 'none';
      panel.innerHTML = '';
      return;
    }

    const q = query.toLowerCase().trim();
    const results = [];

    // Search posts
    this.posts.forEach(post => {
      const user = getUserById(post.userId);
      const text = post.content.replace(/<[^>]+>/g, '');
      if (text.toLowerCase().includes(q) || (user && user.fullName.toLowerCase().includes(q))) {
        results.push({ type: 'Publication', title: user ? user.fullName : '', desc: text.substring(0, 80) + '...', link: '#feed', icon: 'fas fa-file-alt' });
      }
    });

    // Search stages
    this.stages.forEach(stage => {
      if (stage.title.toLowerCase().includes(q) || stage.company.toLowerCase().includes(q) || stage.tags.some(t => t.toLowerCase().includes(q))) {
        results.push({ type: 'Stage', title: stage.title, desc: stage.company + ' - ' + stage.location, link: '#stages', icon: 'fas fa-briefcase' });
      }
    });

    // Search resources
    this.resources.forEach(res => {
      if (res.title.toLowerCase().includes(q) || res.description.toLowerCase().includes(q)) {
        results.push({ type: 'Ressource', title: res.title, desc: res.description.substring(0, 80) + '...', link: '#resources', icon: 'fas fa-book' });
      }
    });

    // Search users
    USERS.forEach(user => {
      if (user.fullName.toLowerCase().includes(q) || (user.skills && user.skills.some(s => s.toLowerCase().includes(q)))) {
        results.push({ type: 'Personne', title: user.fullName, desc: user.classe + (user.filiere ? ' - ' + user.filiere : ''), link: '#network', icon: 'fas fa-user' });
      }
    });

    if (results.length === 0) {
      panel.innerHTML = '<div class="search-empty"><i class="fas fa-search"></i><p>Aucun resultat pour "' + query + '"</p></div>';
    } else {
      panel.innerHTML = results.map(r => `
        <a class="search-result-item" href="${r.link}">
          <div class="search-result-icon"><i class="${r.icon}"></i></div>
          <div class="search-result-info">
            <span class="search-result-type">${r.type}</span>
            <h4>${r.title}</h4>
            <p>${r.desc}</p>
          </div>
        </a>
      `).join('');
    }
    panel.style.display = 'block';
  },

  // ====================================================================
  // MOBILE MENU
  // ====================================================================
  toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu') || document.querySelector('.mobile-menu');
    const overlay = document.getElementById('mobile-overlay') || document.querySelector('.mobile-overlay');
    if (menu) menu.classList.toggle('open');
    if (overlay) overlay.classList.toggle('open');
    document.body.classList.toggle('menu-open');
  },

  closeMobileMenu() {
    const menu = document.getElementById('mobile-menu') || document.querySelector('.mobile-menu');
    const overlay = document.getElementById('mobile-overlay') || document.querySelector('.mobile-overlay');
    if (menu) menu.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.classList.remove('menu-open');
  },

  // ====================================================================
  // SCROLL TO TOP
  // ====================================================================
  initScrollToTop() {
    let btn = document.getElementById('scroll-top-btn');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'scroll-top-btn';
      btn.className = 'scroll-top-btn';
      btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
      btn.style.cssText = 'position:fixed;bottom:80px;right:24px;width:44px;height:44px;border-radius:50%;background:#6366f1;color:#fff;border:none;cursor:pointer;box-shadow:0 4px 12px rgba(99,102,241,.3);opacity:0;transform:translateY(10px);transition:all .3s ease;z-index:999;display:flex;align-items:center;justify-content:center;font-size:1rem;';
      btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      document.body.appendChild(btn);
    }
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        btn.style.opacity = '1';
        btn.style.transform = 'translateY(0)';
      } else {
        btn.style.opacity = '0';
        btn.style.transform = 'translateY(10px)';
      }
    });
  },

  // ====================================================================
  // ANIMATED COUNTERS
  // ====================================================================
  initAnimatedCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (counters.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.counter || el.textContent, 10);
          if (isNaN(target)) return;
          this.animateCounter(el, 0, target, 1500);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  },

  animateCounter(el, start, end, duration) {
    const suffix = el.dataset.suffix || '';
    const startTime = performance.now();
    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const value = Math.floor(start + (end - start) * eased);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  },

  // ====================================================================
  // NAV SCROLL
  // ====================================================================
  initNavScroll() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    });
  },

  // ====================================================================
  // PROGRESS BARS
  // ====================================================================
  initProgressBars() {
    document.querySelectorAll('.progress-fill[data-progress]').forEach(bar => {
      const pct = bar.dataset.progress;
      setTimeout(() => { bar.style.width = pct + '%'; }, 300);
    });
  },

  // ====================================================================
  // APP / LANDING NAVIGATION
  // ====================================================================
  showApp() {
    const landing = document.getElementById('landing');
    const app = document.getElementById('app');
    if (landing) landing.style.display = 'none';
    if (app) { app.style.display = 'flex'; app.classList.add('active'); }
    this.closeMobileMenu();
    window.scrollTo({ top: 0 });
  },

  showLanding() {
    const landing = document.getElementById('landing');
    const app = document.getElementById('app');
    if (landing) landing.style.display = '';
    if (app) { app.style.display = 'none'; app.classList.remove('active'); }
    window.scrollTo({ top: 0 });
  },

  switchView(viewId) {
    // Dynamic views rendered into main-content
    const dynamicViews = ['dashboard', 'candidatures', 'events', 'mentoring'];
    if (dynamicViews.includes(viewId)) {
      document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
      const mc = document.getElementById('view-dynamic');
      if (mc) { mc.classList.add('active'); }
      document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.toggle('active', link.dataset.view === viewId);
      });
      this.activeView = viewId;
      if (viewId === 'dashboard') this.renderDashboard();
      else if (viewId === 'candidatures') this.renderCandidatures();
      else if (viewId === 'events') this.renderEvents();
      else if (viewId === 'mentoring') this.renderMentoring();
      return;
    }
    // Deactivate all views
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    // Activate target
    const target = document.getElementById('view-' + viewId);
    if (target) target.classList.add('active');
    // Update sidebar active state
    document.querySelectorAll('.sidebar-link').forEach(link => {
      link.classList.toggle('active', link.dataset.view === viewId);
    });
    this.activeView = viewId;
  },

  // ====================================================================
  // EVENT LISTENERS (delegation)
  // ====================================================================
  attachEventListeners() {
    // Global click delegation
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]');
      if (!target) {
        // Close search panel on outside click
        const searchPanel = document.getElementById('search-results') || document.querySelector('.search-results');
        if (searchPanel && !e.target.closest('.search-bar')) {
          searchPanel.style.display = 'none';
        }
        // Close notifications on outside click
        const notifPanel = document.getElementById('notifications-panel') || document.querySelector('.notifications-panel');
        if (notifPanel && notifPanel.classList.contains('open') && !e.target.closest('.topbar-actions')) {
          notifPanel.classList.remove('open');
        }
        return;
      }

      const action = target.dataset.action;

      switch (action) {
        case 'toggle-theme':
          this.toggleTheme();
          break;
        case 'like':
          this.toggleLike(target.dataset.postId);
          break;
        case 'comment':
          this.toggleComments(target.dataset.postId);
          break;
        case 'send-comment': {
          const input = target.closest('.comment-input-wrapper').querySelector('.comment-input');
          if (input) this.addComment(target.dataset.postId, input.value);
          break;
        }
        case 'bookmark':
          this.toggleBookmark(target.dataset.postId);
          break;
        case 'share':
          this.sharePost(target.dataset.postId);
          break;
        case 'publish-post': {
          const composer = document.getElementById('post-composer') || document.querySelector('.post-composer textarea, .post-composer input');
          if (composer) {
            this.createPost(composer.value);
            composer.value = '';
          }
          break;
        }
        case 'open-conversation':
          this.openConversation(target.dataset.convId);
          break;
        case 'send-message': {
          const msgInput = document.getElementById('message-input') || document.querySelector('.message-input');
          if (msgInput && this.activeConversation) {
            this.sendMessage(this.activeConversation, msgInput.value);
            msgInput.value = '';
          }
          break;
        }
        case 'toggle-connection':
          this.toggleConnection(target.dataset.userId);
          break;
        case 'toggle-notifications':
          this.toggleNotificationsPanel();
          break;
        case 'read-notification':
          this.markNotificationRead(target.dataset.notifId);
          break;
        case 'edit-profile':
          this.openProfileEdit();
          break;
        case 'save-profile':
          this.saveProfile();
          break;
        case 'close-modal':
          this.closeModal();
          break;
        case 'toggle-mobile-menu':
          this.toggleMobileMenu();
          break;
        case 'close-mobile-menu':
          this.closeMobileMenu();
          break;
        case 'apply-stage':
          this.applyToStage(target.dataset.stageId);
          break;
        case 'confirm-apply':
          this.confirmApply(target.dataset.stageId);
          break;
        case 'toggle-event':
          this.toggleEvent(target.dataset.eventId);
          break;
        case 'request-mentor':
          this.showToast('Demande de mentorat envoyee !');
          break;
        case 'toggle-chatbot':
          this.toggleChatbot();
          break;
        case 'send-chatbot':
          this.sendChatbot();
          break;
        case 'create-resource':
          this.showCreateResource();
          break;
        case 'confirm-create-resource':
          this.confirmCreateResource();
          break;
        case 'toggle-accessibility':
          this.toggleAccessibility();
          break;
        case 'export-pdf':
          this.exportProfilePDF();
          break;
        case 'like-resource':
          this.likeResource(target.dataset.resourceId);
          break;
        case 'download-resource':
          this.downloadResource(target.dataset.resourceId);
          break;
        case 'view-user':
          this.viewUserProfile(target.dataset.userId);
          break;
        case 'go-back':
          this.goBack();
          break;
        case 'nav-link':
          this.closeMobileMenu();
          break;
        case 'show-app':
          e.preventDefault();
          this.showApp();
          break;
        case 'show-landing':
          this.showLanding();
          break;
        case 'close-menu':
          this.closeMobileMenu();
          break;
      }
    });

    // Sidebar view switching
    document.querySelectorAll('.sidebar-link[data-view]').forEach(link => {
      link.addEventListener('click', () => {
        this.switchView(link.dataset.view);
      });
    });

    // Filter chips for stages
    document.querySelectorAll('[data-filter-stage]').forEach(chip => {
      chip.addEventListener('click', () => {
        this.filterStages(chip.dataset.filterStage);
      });
    });

    // Filter chips for resources
    document.querySelectorAll('[data-filter-resource]').forEach(chip => {
      chip.addEventListener('click', () => {
        this.filterResources(chip.dataset.filterResource);
      });
    });

    // Search input
    const searchInput = document.getElementById('search-input') || document.querySelector('.search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.handleSearch(e.target.value);
      });
      searchInput.addEventListener('focus', (e) => {
        if (e.target.value.trim().length >= 2) {
          this.performSearch(e.target.value);
        }
      });
    }

    // Comment input enter key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.classList.contains('comment-input')) {
        e.preventDefault();
        const postId = e.target.dataset.postId;
        if (postId) this.addComment(postId, e.target.value);
      }
      // Message input enter key
      if (e.key === 'Enter' && (e.target.id === 'message-input' || e.target.classList.contains('message-input'))) {
        e.preventDefault();
        if (this.activeConversation) {
          this.sendMessage(this.activeConversation, e.target.value);
          e.target.value = '';
        }
      }
    });

    // Chatbot input enter key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.id === 'chatbot-input') {
        e.preventDefault();
        this.sendChatbot();
      }
    });

    // Modal overlay click to close
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        this.closeModal();
        const applyModal = document.getElementById('apply-modal');
        if (applyModal && e.target === applyModal) applyModal.remove();
        const resModal = document.getElementById('create-resource-modal');
        if (resModal && e.target === resModal) resModal.remove();
      }
    });
  },

  // ====================================================================
  // DASHBOARD
  // ====================================================================
  renderDashboard() {
    const container = document.getElementById('main-content') || document.querySelector('.main-content');
    if (!container) return;
    const connCount = this.connections.filter(c => c.connected).length;
    const postCount = this.posts.filter(p => p.userId === 'user_amira').length;
    const candCount = this.candidatures.length;
    const acceptedCount = this.candidatures.filter(c => c.status === 'acceptee').length;
    const badgeCount = BADGES.filter(b => b.earned).length;
    const totalBadges = BADGES.length;
    const profileProgress = Math.min(100, Math.round((CURRENT_USER.bio ? 20 : 0) + (CURRENT_USER.skills.length > 0 ? 20 : 0) + (connCount > 0 ? 20 : 0) + (postCount > 0 ? 20 : 0) + (candCount > 0 ? 20 : 0)));

    // Recommended stages
    const userSkills = CURRENT_USER.skills.map(s => s.toLowerCase());
    const recommended = this.stages.filter(s => {
      const tags = s.tags.map(t => t.toLowerCase());
      return tags.some(t => userSkills.some(sk => t.includes(sk) || sk.includes(t))) || s.category === 'commerce' || s.category === 'communication';
    }).slice(0, 3);

    container.innerHTML = `
      <div class="dashboard" style="animation:fadeInUp .3s ease">
        <div class="dash-welcome">
          <h2>Bonjour ${CURRENT_USER.firstName} !</h2>
          <p style="color:var(--ink-2);margin-top:4px">Voici ton tableau de bord</p>
        </div>

        <div class="dash-stats-grid">
          <div class="dash-stat-card">
            <div class="dash-stat-icon" style="background:#dbeafe;color:#3b82f6"><i class="fas fa-users"></i></div>
            <div class="dash-stat-value">${CURRENT_USER.connections + connCount}</div>
            <div class="dash-stat-label">Connexions</div>
          </div>
          <div class="dash-stat-card">
            <div class="dash-stat-icon" style="background:#ede9fe;color:#8b5cf6"><i class="fas fa-paper-plane"></i></div>
            <div class="dash-stat-value">${candCount}</div>
            <div class="dash-stat-label">Candidatures</div>
          </div>
          <div class="dash-stat-card">
            <div class="dash-stat-icon" style="background:#d1fae5;color:#22c55e"><i class="fas fa-check-circle"></i></div>
            <div class="dash-stat-value">${acceptedCount}</div>
            <div class="dash-stat-label">Acceptees</div>
          </div>
          <div class="dash-stat-card">
            <div class="dash-stat-icon" style="background:#fef3c7;color:#f59e0b"><i class="fas fa-trophy"></i></div>
            <div class="dash-stat-value">${badgeCount}/${totalBadges}</div>
            <div class="dash-stat-label">Badges</div>
          </div>
        </div>

        <div class="dash-progress-section">
          <h3><i class="fas fa-chart-line"></i> Profil complete a ${profileProgress}%</h3>
          <div class="dash-progress-bar"><div class="dash-progress-fill" style="width:${profileProgress}%"></div></div>
        </div>

        ${recommended.length > 0 ? `
        <div class="dash-section">
          <h3><i class="fas fa-magic"></i> Stages recommandes pour toi</h3>
          <div class="dash-reco-list">
            ${recommended.map(s => `
              <div class="dash-reco-card">
                <div class="dash-reco-icon" style="background:${s.iconBg};color:${s.iconColor}"><i class="${s.icon}"></i></div>
                <div class="dash-reco-info">
                  <h4>${s.title}</h4>
                  <p>${s.company} - ${s.location}</p>
                </div>
                <button class="btn-sm btn-primary" data-action="apply-stage" data-stage-id="${s.id}">Postuler</button>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <div class="dash-section">
          <h3><i class="fas fa-fire"></i> Classement de la semaine</h3>
          <div class="dash-leaderboard">
            ${LEADERBOARD.slice(0, 5).map((entry, i) => {
              const u = getUserById(entry.userId);
              if (!u) return '';
              const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '';
              const isMe = entry.userId === 'user_amira';
              return `
                <div class="lb-row ${isMe ? 'lb-me' : ''}">
                  <span class="lb-rank">${medal || (i+1)}</span>
                  <div class="lb-avatar" style="background:${u.color}">${u.initials}</div>
                  <span class="lb-name">${u.fullName}${isMe ? ' (toi)' : ''}</span>
                  <span class="lb-points">${entry.points} pts</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  },

  // ====================================================================
  // CANDIDATURES
  // ====================================================================
  renderCandidatures() {
    const container = document.getElementById('main-content') || document.querySelector('.main-content');
    if (!container) return;
    const statusColors = { envoyee: '#3b82f6', vue: '#f59e0b', acceptee: '#22c55e', refusee: '#ef4444' };
    const statusLabels = { envoyee: 'Envoyee', vue: 'Vue', acceptee: 'Acceptee', refusee: 'Refusee' };
    const statusIcons = { envoyee: 'fas fa-paper-plane', vue: 'fas fa-eye', acceptee: 'fas fa-check-circle', refusee: 'fas fa-times-circle' };

    container.innerHTML = `
      <div class="candidatures-view" style="animation:fadeInUp .3s ease">
        <div class="section-header">
          <h2><i class="fas fa-paper-plane"></i> Mes candidatures</h2>
          <span class="section-count">${this.candidatures.length} candidature${this.candidatures.length > 1 ? 's' : ''}</span>
        </div>
        ${this.candidatures.length === 0 ? '<div class="empty-state"><i class="fas fa-paper-plane"></i><p>Aucune candidature envoyee. Consulte les stages et postule !</p></div>' : ''}
        <div class="cand-list">
          ${this.candidatures.map(cand => {
            const stage = this.stages.find(s => s.id === cand.stageId);
            if (!stage) return '';
            const color = statusColors[cand.status];
            return `
              <div class="cand-card">
                <div class="cand-status-bar" style="background:${color}"></div>
                <div class="cand-icon" style="background:${stage.iconBg};color:${stage.iconColor}"><i class="${stage.icon}"></i></div>
                <div class="cand-info">
                  <h4>${stage.title}</h4>
                  <p class="cand-company">${stage.company} - ${stage.location}</p>
                  <p class="cand-date">Postule le ${new Date(cand.appliedDate).toLocaleDateString('fr-FR')}</p>
                </div>
                <div class="cand-status" style="background:${color}20;color:${color}">
                  <i class="${statusIcons[cand.status]}"></i> ${statusLabels[cand.status]}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  applyToStage(stageId) {
    if (this.candidatures.find(c => c.stageId === stageId)) {
      this.showToast('Tu as deja postule a ce stage');
      return;
    }
    const stage = this.stages.find(s => s.id === stageId);
    if (!stage) return;

    // Show apply modal
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay open';
    overlay.id = 'apply-modal';
    overlay.innerHTML = `
      <div class="modal-box" style="max-width:480px">
        <h3 style="margin-bottom:4px">Postuler : ${stage.title}</h3>
        <p style="color:var(--ink-3);font-size:13px;margin-bottom:20px">${stage.company} - ${stage.location}</p>
        <label style="font-size:13px;font-weight:600;display:block;margin-bottom:6px">Ta motivation</label>
        <textarea id="apply-motivation" rows="4" placeholder="Pourquoi ce stage t'interesse..." style="width:100%;padding:12px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-family:var(--font);font-size:14px;resize:vertical"></textarea>
        <div style="display:flex;gap:10px;margin-top:16px;justify-content:flex-end">
          <button class="btn-sm btn-ghost" data-action="close-modal">Annuler</button>
          <button class="btn-sm btn-primary" data-action="confirm-apply" data-stage-id="${stageId}">Envoyer</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  },

  confirmApply(stageId) {
    const textarea = document.getElementById('apply-motivation');
    const motivation = textarea ? textarea.value.trim() : '';
    const newCand = {
      id: 'cand_' + Date.now(),
      stageId: stageId,
      status: 'envoyee',
      motivation: motivation || 'Candidature spontanee',
      appliedDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0]
    };
    this.candidatures.push(newCand);
    Storage.set('candidatures', this.candidatures);
    this.closeModal();
    const modal = document.getElementById('apply-modal');
    if (modal) modal.remove();
    this.showToast('Candidature envoyee !');
  },

  // ====================================================================
  // EVENTS
  // ====================================================================
  renderEvents() {
    const container = document.getElementById('main-content') || document.querySelector('.main-content');
    if (!container) return;
    const sortedEvents = [...this.events].sort((a, b) => new Date(a.date) - new Date(b.date));

    container.innerHTML = `
      <div class="events-view" style="animation:fadeInUp .3s ease">
        <div class="section-header">
          <h2><i class="fas fa-calendar-alt"></i> Evenements</h2>
        </div>
        <div class="events-list">
          ${sortedEvents.map(evt => {
            const d = new Date(evt.date);
            const day = d.getDate();
            const month = d.toLocaleDateString('fr-FR', { month: 'short' });
            return `
              <div class="event-card">
                <div class="event-date-badge">
                  <span class="event-day">${day}</span>
                  <span class="event-month">${month}</span>
                </div>
                <div class="event-content">
                  <div class="event-type-badge" style="background:${evt.iconBg};color:${evt.iconColor}"><i class="${evt.icon}"></i></div>
                  <h4>${evt.title}</h4>
                  <p class="event-desc">${evt.description}</p>
                  <div class="event-meta">
                    <span><i class="fas fa-clock"></i> ${evt.time}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${evt.location}</span>
                    <span><i class="fas fa-users"></i> ${evt.attendees} inscrits</span>
                  </div>
                </div>
                <button class="btn-sm ${evt.registered ? 'btn-success' : 'btn-primary'}" data-action="toggle-event" data-event-id="${evt.id}">
                  ${evt.registered ? '<i class="fas fa-check"></i> Inscrit' : 'S\'inscrire'}
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  toggleEvent(eventId) {
    const evt = this.events.find(e => e.id === eventId);
    if (!evt) return;
    evt.registered = !evt.registered;
    evt.attendees += evt.registered ? 1 : -1;
    Storage.set('events', this.events);
    this.showToast(evt.registered ? 'Inscrit a l\'evenement !' : 'Desinscrit');
    this.renderEvents();
  },

  // ====================================================================
  // MENTORING
  // ====================================================================
  renderMentoring() {
    const container = document.getElementById('main-content') || document.querySelector('.main-content');
    if (!container) return;

    container.innerHTML = `
      <div class="mentoring-view" style="animation:fadeInUp .3s ease">
        <div class="section-header">
          <h2><i class="fas fa-hands-helping"></i> Mentorat</h2>
          <p style="color:var(--ink-2);font-size:14px;margin-top:4px">Trouve un mentor pour t'accompagner</p>
        </div>
        <div class="mentors-list">
          ${this.mentors.map(mentor => {
            const user = getUserById(mentor.userId);
            if (!user) return '';
            const stars = '★'.repeat(Math.floor(mentor.rating)) + (mentor.rating % 1 >= 0.5 ? '½' : '');
            return `
              <div class="mentor-card">
                <div class="mentor-avatar" style="background:${user.color}">${user.initials}</div>
                <div class="mentor-info">
                  <h4>${user.fullName}</h4>
                  <p class="mentor-specialty">${mentor.specialty}</p>
                  <p class="mentor-avail"><i class="fas fa-clock"></i> ${mentor.availability}</p>
                  <div class="mentor-stats">
                    <span class="mentor-rating" style="color:#f59e0b">${stars} ${mentor.rating}</span>
                    <span><i class="fas fa-video"></i> ${mentor.sessions} sessions</span>
                  </div>
                </div>
                <button class="btn-sm btn-primary" data-action="request-mentor" data-mentor-id="${mentor.id}">
                  <i class="fas fa-hand-paper"></i> Demander
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  // ====================================================================
  // CHATBOT
  // ====================================================================
  toggleChatbot() {
    this.chatbotOpen = !this.chatbotOpen;
    let widget = document.getElementById('chatbot-widget');
    if (!widget) {
      widget = document.createElement('div');
      widget.id = 'chatbot-widget';
      widget.className = 'chatbot-widget';
      widget.innerHTML = `
        <div class="chatbot-header">
          <div style="display:flex;align-items:center;gap:8px">
            <div style="width:28px;height:28px;border-radius:8px;background:var(--grad-cool);display:grid;place-items:center;color:#fff;font-size:10px;font-weight:900">L.U</div>
            <span style="font-weight:700;font-size:14px">Assistant LINKED.U</span>
          </div>
          <button data-action="toggle-chatbot" style="background:none;border:none;cursor:pointer;font-size:18px;color:var(--ink-3)"><i class="fas fa-times"></i></button>
        </div>
        <div class="chatbot-messages" id="chatbot-messages">
          <div class="cb-msg cb-bot">Salut ! Je suis l'assistant LINKED.U. Pose-moi une question sur les stages, le CV, l'orientation...</div>
        </div>
        <div class="chatbot-input-area">
          <input type="text" id="chatbot-input" placeholder="Ecris ta question..." class="chatbot-input">
          <button data-action="send-chatbot" class="chatbot-send"><i class="fas fa-paper-plane"></i></button>
        </div>
      `;
      document.body.appendChild(widget);
    }
    widget.classList.toggle('open', this.chatbotOpen);
  },

  sendChatbot() {
    const input = document.getElementById('chatbot-input');
    const container = document.getElementById('chatbot-messages');
    if (!input || !container) return;
    const text = input.value.trim();
    if (!text) return;

    // Add user message
    container.insertAdjacentHTML('beforeend', `<div class="cb-msg cb-user">${text}</div>`);
    input.value = '';

    // Find response
    const q = text.toLowerCase();
    let response = 'Je n\'ai pas de reponse precise pour cette question. Essaie de me demander des infos sur les stages, le CV, la lettre de motivation, l\'orientation ou Parcoursup !';
    for (const entry of CHATBOT_RESPONSES) {
      if (entry.keywords.some(kw => q.includes(kw))) {
        response = entry.response;
        break;
      }
    }

    // Add bot response with delay
    setTimeout(() => {
      container.insertAdjacentHTML('beforeend', `<div class="cb-msg cb-bot">${response}</div>`);
      container.scrollTop = container.scrollHeight;
    }, 500);

    container.scrollTop = container.scrollHeight;
  },

  // ====================================================================
  // CREATE RESOURCE
  // ====================================================================
  showCreateResource() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay open';
    overlay.id = 'create-resource-modal';
    overlay.innerHTML = `
      <div class="modal-box" style="max-width:520px">
        <h3 style="margin-bottom:16px"><i class="fas fa-plus-circle"></i> Partager une ressource</h3>
        <label class="form-label">Titre</label>
        <input type="text" id="res-title" placeholder="Ex: Fiche revision economie..." class="form-input">
        <label class="form-label">Description</label>
        <textarea id="res-desc" rows="3" placeholder="Decris ta ressource..." class="form-input" style="resize:vertical"></textarea>
        <label class="form-label">Type</label>
        <select id="res-type" class="form-input">
          <option value="fiche">Fiche de revision</option>
          <option value="modele">Modele / Template</option>
          <option value="guide">Guide pratique</option>
        </select>
        <label class="form-label">Categorie</label>
        <select id="res-category" class="form-input">
          <option value="cours">Cours</option>
          <option value="candidature">Candidature</option>
          <option value="stage">Stage</option>
        </select>
        <label class="form-label">Tags (separes par des virgules)</label>
        <input type="text" id="res-tags" placeholder="Ex: MSDGN, 1re STMG" class="form-input">
        <div style="display:flex;gap:10px;margin-top:20px;justify-content:flex-end">
          <button class="btn-sm btn-ghost" data-action="close-modal">Annuler</button>
          <button class="btn-sm btn-primary" data-action="confirm-create-resource">Publier</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  },

  confirmCreateResource() {
    const title = document.getElementById('res-title')?.value.trim();
    const desc = document.getElementById('res-desc')?.value.trim();
    const type = document.getElementById('res-type')?.value;
    const category = document.getElementById('res-category')?.value;
    const tags = document.getElementById('res-tags')?.value.split(',').map(t => t.trim()).filter(Boolean);

    if (!title) { this.showToast('Ajoute un titre'); return; }

    const typeMap = {
      fiche: { label: 'Fiche de revision', icon: 'fas fa-file-alt', color: '#3b82f6' },
      modele: { label: 'Modele', icon: 'fas fa-file-word', color: '#8b5cf6' },
      guide: { label: 'Guide', icon: 'fas fa-book', color: '#22c55e' }
    };
    const t = typeMap[type] || typeMap.fiche;

    const newRes = {
      id: 'res_' + Date.now(),
      userId: 'user_amira',
      title: title,
      description: desc || 'Ressource partagee par ' + CURRENT_USER.fullName,
      type: type,
      typeLabel: t.label,
      typeIcon: t.icon,
      typeColor: t.color,
      downloads: 0,
      likes: 0,
      comments: 0,
      category: category,
      tags: tags.length > 0 ? tags : [category]
    };

    this.resources.unshift(newRes);
    Storage.set('resources', this.resources);

    const modal = document.getElementById('create-resource-modal');
    if (modal) modal.remove();
    this.showToast('Ressource publiee !');
    if (this.activeView === 'ressources') this.renderResources();
  },

  // ====================================================================
  // ACCESSIBILITY
  // ====================================================================
  toggleAccessibility() {
    this.accessibilityMode = !this.accessibilityMode;
    Storage.set('accessibility', this.accessibilityMode);
    document.body.classList.toggle('accessibility-mode', this.accessibilityMode);
    this.showToast(this.accessibilityMode ? 'Mode accessibilite active' : 'Mode accessibilite desactive');
  },

  initAccessibility() {
    if (this.accessibilityMode) {
      document.body.classList.add('accessibility-mode');
    }
  },

  // ====================================================================
  // EXPORT PDF
  // ====================================================================
  exportProfilePDF() {
    const profile = Storage.get('profile', { bio: CURRENT_USER.bio, headline: CURRENT_USER.headline, skills: CURRENT_USER.skills.join(', ') });
    const connCount = this.connections.filter(c => c.connected).length;
    const skills = profile.skills ? profile.skills.split(',').map(s => s.trim()) : CURRENT_USER.skills;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>CV - ${CURRENT_USER.fullName}</title>
        <style>
          *{margin:0;padding:0;box-sizing:border-box}
          body{font-family:'Segoe UI',system-ui,sans-serif;padding:40px;max-width:700px;margin:0 auto;color:#1a1a2e;line-height:1.6}
          .header{text-align:center;padding-bottom:24px;border-bottom:3px solid #6C5CE7;margin-bottom:24px}
          .name{font-size:28px;font-weight:800;color:#6C5CE7}
          .headline{font-size:14px;color:#666;margin-top:4px}
          .section{margin-bottom:20px}
          .section h2{font-size:16px;text-transform:uppercase;letter-spacing:1px;color:#6C5CE7;border-bottom:1px solid #eee;padding-bottom:6px;margin-bottom:10px}
          .section p{font-size:14px}
          .skills{display:flex;flex-wrap:wrap;gap:8px}
          .skill{background:#EDE9FF;color:#6C5CE7;padding:4px 12px;border-radius:12px;font-size:12px;font-weight:600}
          .stats{display:flex;gap:24px;margin-top:8px}
          .stat{text-align:center}
          .stat-val{font-size:20px;font-weight:800;color:#6C5CE7}
          .stat-label{font-size:11px;color:#888}
          .badge-list{display:flex;flex-wrap:wrap;gap:6px}
          .badge-item{font-size:12px;background:#f0fdf4;color:#22c55e;padding:4px 10px;border-radius:10px}
          .footer{margin-top:32px;text-align:center;font-size:11px;color:#999;border-top:1px solid #eee;padding-top:12px}
          @media print{body{padding:20px}}
        </style>
      </head>
      <body>
        <div class="header">
          <div class="name">${CURRENT_USER.fullName}</div>
          <div class="headline">${profile.headline || CURRENT_USER.headline}</div>
          <div class="headline">${CURRENT_USER.lycee}</div>
        </div>
        <div class="section">
          <h2>A propos</h2>
          <p>${profile.bio || CURRENT_USER.bio}</p>
        </div>
        <div class="section">
          <h2>Formation</h2>
          <p><strong>${CURRENT_USER.classe} - ${CURRENT_USER.filiere}</strong></p>
          <p>${CURRENT_USER.lycee}</p>
        </div>
        <div class="section">
          <h2>Competences</h2>
          <div class="skills">${skills.map(s => `<span class="skill">${s}</span>`).join('')}</div>
        </div>
        <div class="section">
          <h2>Activite LINKED.U</h2>
          <div class="stats">
            <div class="stat"><div class="stat-val">${CURRENT_USER.connections + connCount}</div><div class="stat-label">Connexions</div></div>
            <div class="stat"><div class="stat-val">${CURRENT_USER.posts}</div><div class="stat-label">Publications</div></div>
            <div class="stat"><div class="stat-val">${CURRENT_USER.views}</div><div class="stat-label">Vues du profil</div></div>
          </div>
        </div>
        <div class="section">
          <h2>Badges obtenus</h2>
          <div class="badge-list">
            ${BADGES.filter(b => b.earned).map(b => `<span class="badge-item">${b.title}</span>`).join('')}
          </div>
        </div>
        <div class="footer">Genere depuis LINKED.U - Le reseau pro des lyceens</div>
      </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 300);
    this.showToast('CV genere !');
  },

  // ====================================================================
  // UTILITY FUNCTIONS
  // ====================================================================
  timeAgo(timestamp) {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'A l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  },

  timeShort(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - date) / 86400000);
    if (diffDays < 1) return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    if (diffDays < 7) return date.toLocaleDateString('fr-FR', { weekday: 'short' });
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  },

  formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  }
};

// ====================================================================
// BOOT
// ====================================================================
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
