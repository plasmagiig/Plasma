// Mock data for Plasma platform - used for demonstration and testing

export const mockUsers = [
  {
    id: "user-1",
    username: "alexchen",
    email: "alex@plasma.com",
    displayName: "Alex Chen",
    bio: "Tech creator exploring the future of Web3 and decentralized technology. Building the creator economy of tomorrow with innovative blockchain solutions.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=150&h=150&fit=crop&face",
    energyLevel: 1247,
    totalEarnings: "2847.93",
    followersCount: 12400,
    followingCount: 234,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "user-2", 
    username: "mayarodriguez",
    email: "maya@plasma.com",
    displayName: "Maya Rodriguez",
    bio: "Digital artist creating immersive experiences and NFT collections. Specializing in 3D art, motion graphics, and interactive installations.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&w=150&h=150&fit=crop&face",
    energyLevel: 2876,
    totalEarnings: "4523.67", 
    followersCount: 18600,
    followingCount: 156,
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "user-3",
    username: "davidkim", 
    email: "david@plasma.com",
    displayName: "David Kim",
    bio: "Entrepreneur building the creator economy of tomorrow. Investor, mentor, and advocate for decentralized creative platforms.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=150&h=150&fit=crop&face",
    energyLevel: 945,
    totalEarnings: "12456.78",
    followersCount: 9800,
    followingCount: 89, 
    createdAt: new Date("2024-01-05"),
  },
  {
    id: "user-4",
    username: "sarahwilson",
    email: "sarah@plasma.com", 
    displayName: "Sarah Wilson",
    bio: "Music producer and audio engineer crafting the soundscape of Web3. Electronic music meets blockchain innovation.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&w=150&h=150&fit=crop&face",
    energyLevel: 1856,
    totalEarnings: "3421.45",
    followersCount: 15200,
    followingCount: 312,
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "user-5",
    username: "mikejohnson",
    email: "mike@plasma.com",
    displayName: "Mike Johnson", 
    bio: "Fitness coach and wellness advocate. Helping creators maintain physical and mental health in the digital age.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&w=150&h=150&fit=crop&face",
    energyLevel: 1123,
    totalEarnings: "1987.32",
    followersCount: 8900,
    followingCount: 445,
    createdAt: new Date("2024-01-25"),
  }
];

export const mockContent = [
  {
    id: "content-1",
    userId: "user-1",
    type: "video",
    title: "Building the Future of Web3 Creator Economy", 
    description: "Deep dive into how blockchain technology is revolutionizing content creation, monetization, and creator ownership. Exploring smart contracts, NFTs, and decentralized platforms.",
    fileUrl: "/api/content/video-1.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1547082299-de196ea013d6?ixlib=rb-4.0.3&w=400&h=225&fit=crop",
    duration: 754,
    energyBoosts: 847,
    resonance: 234, 
    amplify: 89,
    earnings: "43.20",
    isPublished: true,
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "content-2",
    userId: "user-2", 
    type: "giig",
    title: "60 Second Digital Art Creation Challenge",
    description: "Watch me create a stunning digital masterpiece in under a minute using only Procreate and Apple Pencil. Time-lapse magic at its finest!",
    fileUrl: "/api/content/giig-1.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?ixlib=rb-4.0.3&w=300&h=533&fit=crop",
    duration: 45,
    energyBoosts: 1200,
    resonance: 456,
    amplify: 178,
    earnings: "67.80",
    isPublished: true,
    createdAt: new Date("2024-02-02"),
  },
  {
    id: "content-3",
    userId: "user-3",
    type: "post", 
    title: "My First $10k Month on Plasma - Creator Economy Insights",
    description: "Just hit my first $10k month on Plasma! 🚀 Here's what I learned about building a sustainable creator business in the new economy. Key strategies: authentic engagement, energy-based content, and community building. The future is bright for creators who embrace innovation!",
    energyBoosts: 567,
    resonance: 123,
    amplify: 45,
    earnings: "23.45",
    isPublished: true,
    createdAt: new Date("2024-02-03"),
  },
  {
    id: "content-4",
    userId: "user-4",
    type: "video",
    title: "Producing Electronic Music for the Metaverse",
    description: "Creating immersive audio experiences for virtual worlds. Learn my production techniques for spatial audio, dynamic soundscapes, and interactive music systems.",
    fileUrl: "/api/content/video-2.mp4", 
    thumbnailUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&w=400&h=225&fit=crop",
    duration: 892,
    energyBoosts: 623,
    resonance: 298,
    amplify: 156,
    earnings: "78.90",
    isPublished: true,
    createdAt: new Date("2024-02-04"),
  },
  {
    id: "content-5",
    userId: "user-5",
    type: "giig",
    title: "5-Minute Morning Energy Boost Routine",
    description: "Start your creative day right! Quick morning routine to boost energy and focus for content creators. No equipment needed!",
    fileUrl: "/api/content/giig-2.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&w=300&h=533&fit=crop",
    duration: 58,
    energyBoosts: 445,
    resonance: 189,
    amplify: 67,
    earnings: "34.50",
    isPublished: true, 
    createdAt: new Date("2024-02-05"),
  },
  {
    id: "content-6",
    userId: "user-1",
    type: "post",
    title: "The Psychology of Energy-Based Social Media",
    description: "Why traditional likes and comments are broken, and how energy-based interactions create more meaningful connections between creators and audiences. The science behind authentic engagement in digital communities.",
    energyBoosts: 234,
    resonance: 89,
    amplify: 34,
    earnings: "15.60",
    isPublished: true,
    createdAt: new Date("2024-02-06"),
  },
  {
    id: "content-7", 
    userId: "user-2",
    type: "video",
    title: "3D Animation Techniques for NFT Collections",
    description: "Master class in creating stunning 3D animations for NFT projects. From modeling to rendering, learn the complete workflow for premium digital art.",
    fileUrl: "/api/content/video-3.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?ixlib=rb-4.0.3&w=400&h=225&fit=crop", 
    duration: 1245,
    energyBoosts: 789,
    resonance: 345,
    amplify: 123,
    earnings: "92.40",
    isPublished: true,
    createdAt: new Date("2024-02-07"),
  },
  {
    id: "content-8",
    userId: "user-4",
    type: "giig", 
    title: "Beat Drop Challenge - Bass Heavy",
    description: "Massive bass drop compilation! Can you feel the energy through your screen? 🔊⚡ #BassHead #ElectronicMusic #EnergyBoost",
    fileUrl: "/api/content/giig-3.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1571266028243-d220c2fcc930?ixlib=rb-4.0.3&w=300&h=533&fit=crop",
    duration: 30,
    energyBoosts: 678,
    resonance: 234,
    amplify: 98,
    earnings: "45.30",
    isPublished: true,
    createdAt: new Date("2024-02-08"),
  }
];

export const mockInteractions = [
  {
    id: "int-1",
    userId: "user-2",
    contentId: "content-1", 
    type: "boost",
    energyValue: 1,
    createdAt: new Date("2024-02-01T10:30:00"),
  },
  {
    id: "int-2", 
    userId: "user-3",
    contentId: "content-1",
    type: "resonance", 
    energyValue: 1,
    createdAt: new Date("2024-02-01T11:15:00"),
  },
  {
    id: "int-3",
    userId: "user-1",
    contentId: "content-2",
    type: "boost",
    energyValue: 1,
    createdAt: new Date("2024-02-02T09:45:00"),
  },
  {
    id: "int-4",
    userId: "user-4",
    contentId: "content-2", 
    type: "amplify",
    energyValue: 1,
    createdAt: new Date("2024-02-02T14:20:00"),
  },
  {
    id: "int-5",
    userId: "user-5",
    contentId: "content-3",
    type: "resonance",
    energyValue: 1, 
    createdAt: new Date("2024-02-03T16:10:00"),
  }
];

export const mockEarnings = [
  {
    id: "earn-1",
    userId: "user-1",
    source: "boosts",
    amount: "12.50",
    description: "Energy boosts from 'Building the Future of Web3'",
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "earn-2",
    userId: "user-1", 
    source: "subscriptions",
    amount: "89.47",
    description: "Monthly subscription revenue",
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "earn-3",
    userId: "user-2",
    source: "boosts", 
    amount: "23.80",
    description: "Energy boosts from digital art content",
    createdAt: new Date("2024-02-02"),
  },
  {
    id: "earn-4",
    userId: "user-2",
    source: "store",
    amount: "156.90",
    description: "NFT collection sales",
    createdAt: new Date("2024-02-02"),
  },
  {
    id: "earn-5",
    userId: "user-3",
    source: "tips",
    amount: "45.60", 
    description: "Creator support tips",
    createdAt: new Date("2024-02-03"),
  }
];

export const mockSubscriptions = [
  {
    id: "sub-1",
    subscriberId: "user-2",
    creatorId: "user-1",
    tier: "premium",
    monthlyAmount: "19.99",
    isActive: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "sub-2", 
    subscriberId: "user-3",
    creatorId: "user-2",
    tier: "basic",
    monthlyAmount: "9.99",
    isActive: true,
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "sub-3",
    subscriberId: "user-1",
    creatorId: "user-4",
    tier: "plasma",
    monthlyAmount: "29.99", 
    isActive: true,
    createdAt: new Date("2024-01-25"),
  },
  {
    id: "sub-4",
    subscriberId: "user-4",
    creatorId: "user-3",
    tier: "premium",
    monthlyAmount: "19.99",
    isActive: true,
    createdAt: new Date("2024-01-30"),
  },
  {
    id: "sub-5",
    subscriberId: "user-5",
    creatorId: "user-1", 
    tier: "basic",
    monthlyAmount: "9.99",
    isActive: true,
    createdAt: new Date("2024-02-05"),
  }
];

// Utility functions for working with mock data
export const getMockUserById = (id: string) => {
  return mockUsers.find(user => user.id === id);
};

export const getMockUserByUsername = (username: string) => {
  return mockUsers.find(user => user.username === username);
};

export const getMockContentByUser = (userId: string) => {
  return mockContent.filter(content => content.userId === userId);
};

export const getMockContentWithUsers = () => {
  return mockContent.map(content => ({
    ...content,
    user: getMockUserById(content.userId)
  }));
};

export const getMockEarningsByUser = (userId: string) => {
  return mockEarnings.filter(earning => earning.userId === userId);
};

export const getMockUserEarningsSummary = (userId: string) => {
  const userEarnings = getMockEarningsByUser(userId);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thisWeek = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const total = userEarnings.reduce((sum, earning) => sum + parseFloat(earning.amount), 0);
  const todayEarnings = userEarnings.filter(e => e.createdAt >= today).reduce((sum, earning) => sum + parseFloat(earning.amount), 0);
  const weekEarnings = userEarnings.filter(e => e.createdAt >= thisWeek).reduce((sum, earning) => sum + parseFloat(earning.amount), 0);
  const monthEarnings = userEarnings.filter(e => e.createdAt >= thisMonth).reduce((sum, earning) => sum + parseFloat(earning.amount), 0);

  return {
    total,
    today: todayEarnings,
    thisWeek: weekEarnings, 
    thisMonth: monthEarnings,
  };
};
