// Response transformers to match frontend expectations

// Format date to readable string
const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

// Transform user object
const transformUser = (user) => {
  if (!user) return null;
  const userObj = user.toObject ? user.toObject() : user;
  return {
    id: userObj._id?.toString() || userObj.id,
    name: userObj.name,
    email: userObj.email,
    username: userObj.username,
    avatar: userObj.avatar || '',
    role: userObj.role,
    verified: userObj.verified || false,
    rating: userObj.rating || 0,
    totalRatings: userObj.totalRatings || 0,
    memberSince: userObj.memberSince,
    phone: userObj.phone,
    location: userObj.location,
    bio: userObj.bio,
    createdAt: userObj.createdAt, // Added createdAt
    isBanned: userObj.isBanned || false,
    banReason: userObj.banReason || '',
  };
};

// Transform item object to match frontend format
const transformItem = (item) => {
  if (!item) return null;
  const itemObj = item.toObject ? item.toObject() : item;
  
  // Handle images - split into imageUrl and additionalImages
  const images = itemObj.images || [];
  const imageUrl = images[0] || '';
  const additionalImages = images.slice(1) || [];

  return {
    id: itemObj._id?.toString() || itemObj.id,
    status: itemObj.status,
    title: itemObj.title,
    description: itemObj.description,
    fullDescription: itemObj.fullDescription || itemObj.description,
    category: itemObj.category,
    color: itemObj.color || '',
    location: itemObj.location,
    mapLocation: itemObj.mapLocation || itemObj.location,
    date: formatDate(itemObj.date),
    time: itemObj.time || '',
    imageUrl,
    additionalImages,
    images, // Keep original array for compatibility
    postedBy: itemObj.postedBy ? transformUser(itemObj.postedBy) : null,
    contactName: itemObj.contactName,
    contactEmail: itemObj.contactEmail,
    contactPhone: itemObj.contactPhone,
    isResolved: itemObj.isResolved || false,
    resolvedAt: itemObj.resolvedAt ? formatDate(itemObj.resolvedAt) : null,
    views: itemObj.views || 0,
    createdAt: itemObj.createdAt,
    updatedAt: itemObj.updatedAt,
  };
};

// Transform favorite object
const transformFavorite = (favorite) => {
  if (!favorite) return null;
  const favObj = favorite.toObject ? favorite.toObject() : favorite;
  return {
    id: favObj._id?.toString() || favObj.id,
    user: favObj.user ? transformUser(favObj.user) : favObj.user,
    item: favObj.item ? transformItem(favObj.item) : favObj.item,
    createdAt: favObj.createdAt,
  };
};

// Transform message object
const transformMessage = (message, currentUserEmail = null) => {
  if (!message) return null;
  const msgObj = message.toObject ? message.toObject() : message;
  
  // Get sender and receiver IDs (prefer _id)
  const senderId = msgObj.sender?._id?.toString() || msgObj.senderId || '';
  const receiverId = msgObj.receiver?._id?.toString() || msgObj.receiverId || '';
  
  // Get itemId from conversation if populated, or from direct reference
  let itemId = msgObj.itemId;
  if (!itemId && msgObj.conversation) {
    if (typeof msgObj.conversation === 'object' && msgObj.conversation.item) {
      itemId = msgObj.conversation.item._id?.toString() || msgObj.conversation.item.toString();
    } else if (typeof msgObj.conversation === 'string') {
      // If conversation is just an ID, we need to get itemId from elsewhere
      // This will be handled by the controller
    }
  }
  
  return {
    id: msgObj._id?.toString() || msgObj.id,
    conversationId: typeof msgObj.conversation === 'object' 
      ? (msgObj.conversation._id?.toString() || msgObj.conversation.toString())
      : msgObj.conversation?.toString() || msgObj.conversationId,
    itemId: itemId ? parseInt(itemId) || itemId : undefined, // Try to convert to number for frontend compatibility
    senderId: senderId, // Return ID
    receiverId: receiverId, // Return ID
    sender: msgObj.sender ? transformUser(msgObj.sender) : null,
    receiver: msgObj.receiver ? transformUser(msgObj.receiver) : null,
    content: msgObj.content,
    read: msgObj.read || false,
    readAt: msgObj.readAt,
    timestamp: msgObj.createdAt ? new Date(msgObj.createdAt).toISOString() : msgObj.timestamp,
    createdAt: msgObj.createdAt,
  };
};

// Transform conversation object
const transformConversation = (conversation, currentUserId = null) => {
  if (!conversation) return null;
  const convObj = conversation.toObject ? conversation.toObject() : conversation;
  
  // Find other user
  const participants = convObj.participants || [];
  const otherUser = participants.find(
    (p) => {
      const pId = p._id?.toString() || p.toString();
      const currentId = currentUserId?._id?.toString() || currentUserId?.toString();
      return pId !== currentId;
    }
  );
  
  // Get itemId - handle both populated and ObjectId cases
  let itemId = convObj.itemId;
  if (!itemId && convObj.item) {
    if (typeof convObj.item === 'object') {
      itemId = convObj.item._id?.toString() || convObj.item.toString();
    } else {
      itemId = convObj.item.toString();
    }
  }
  
  return {
    id: convObj._id?.toString() || convObj.id,
    itemId: itemId ? (parseInt(itemId) || itemId) : undefined, // Try number for frontend compatibility
    item: convObj.item && typeof convObj.item === 'object' ? transformItem(convObj.item) : null,
    otherUserId: otherUser?._id?.toString() || otherUser?.toString() || otherUser?.email, // Prefer ID
    otherUser: otherUser ? transformUser(otherUser) : null,
    participants: participants.map((p) => typeof p === 'object' ? transformUser(p) : p),
    lastMessage: convObj.lastMessage && typeof convObj.lastMessage === 'object' 
      ? transformMessage(convObj.lastMessage) 
      : null,
    lastMessageAt: convObj.lastMessageAt,
    unreadCount: convObj.unreadCount || 0,
    createdAt: convObj.createdAt,
    updatedAt: convObj.updatedAt,
  };
};

// Transform review object
const transformReview = (review) => {
  if (!review) return null;
  const reviewObj = review.toObject ? review.toObject() : review;
  return {
    id: reviewObj._id?.toString() || reviewObj.id,
    reviewer: reviewObj.reviewer ? transformUser(reviewObj.reviewer) : null,
    reviewee: reviewObj.reviewee ? transformUser(reviewObj.reviewee) : null,
    reviewerId: reviewObj.reviewer?.email || reviewObj.reviewerId,
    revieweeId: reviewObj.reviewee?._id?.toString() || reviewObj.revieweeId,
    rating: reviewObj.rating,
    comment: reviewObj.comment || '',
    item: reviewObj.item ? transformItem(reviewObj.item) : null,
    createdAt: reviewObj.createdAt,
  };
};

// Transform search alert object
const transformSearchAlert = (alert) => {
  if (!alert) return null;
  const alertObj = alert.toObject ? alert.toObject() : alert;
  return {
    id: alertObj._id?.toString() || alertObj.id,
    userId: alertObj.user?.email || alertObj.userId,
    user: alertObj.user ? transformUser(alertObj.user) : null,
    name: alertObj.name,
    filters: alertObj.filters || {},
    active: alertObj.active !== false,
    createdAt: alertObj.createdAt ? new Date(alertObj.createdAt).toISOString() : alertObj.createdAt,
    updatedAt: alertObj.updatedAt,
  };
};

// Transform array of items
const transformItems = (items) => {
  return items.map(transformItem);
};

// Transform array of favorites (return just item IDs for frontend compatibility)
const transformFavoritesToIds = (favorites) => {
  return favorites.map((fav) => {
    const item = fav.item || fav;
    return item._id?.toString() || item.id || item.toString();
  });
};

module.exports = {
  formatDate,
  transformUser,
  transformItem,
  transformItems,
  transformFavorite,
  transformMessage,
  transformConversation,
  transformReview,
  transformSearchAlert,
  transformFavoritesToIds,
};

