import { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import MobileLayout from "../components/layout/MobileLayout";
import { Link } from "react-router-dom";
import { UserPlus, Search, MessageSquare, Award, Heart } from "lucide-react";

export default function FriendsPage() {
    const [friends, setFriends] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddFriend, setShowAddFriend] = useState(false);
    const [friendRequest, setFriendRequest] = useState("");
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const [activeTab, setActiveTab] = useState('friends'); // 'friends' or 'requests'
    const [sentRequests, setSentRequests] = useState([
        {
            id: 1,
            username: "PixelMaster",
            petName: "Byte",
            petType: "Pixel Cat",
            sentAt: "2 hours ago",
            avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=PixelMaster`
        },
        {
            id: 2,
            username: "TamaQueen",
            petName: "Sparkle",
            petType: "Pixel Cat",
            sentAt: "1 day ago",
            avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=TamaQueen`
        }
    ]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const getFriends = async () => {
            try {
                const mockFriends = [
                    {
                        id: 1,
                        username: "PetLover123",
                        petName: "Toto",
                        petType: "Pixel Cat",
                        petLevel: 5,
                        streak: 12,
                        lastActive: "2 hours ago",
                        avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=PetLover123`
                    },
                    {
                        id: 2,
                        username: "HabitHero",
                        petName: "Fluffy",
                        petType: "Pixel Cat",
                        petLevel: 8,
                        streak: 23,
                        lastActive: "Just now",
                        avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=HabitHero`
                    },
                    {
                        id: 3,
                        username: "TamaQueen",
                        petName: "Sparkle",
                        petType: "Pixel Cat",
                        petLevel: 10,
                        streak: 45,
                        lastActive: "5 days ago",
                        avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=TamaQueen`
                    },
                    {
                        id: 4,
                        username: "PixelMaster",
                        petName: "Byte",
                        petType: "Pixel Cat",
                        petLevel: 7,
                        streak: 19,
                        lastActive: "Yesterday",
                        avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=PixelMaster`
                    }
                ];

                setFriends(mockFriends);
            } catch (error) {
                console.error("Error fetching friends:", error);
            } finally {
                setIsLoading(false);
            }
        };

        getFriends();
    }, []);

    const handleAddFriend = async (e) => {
        e.preventDefault();
        if (!friendRequest.trim()) return;

        setIsSending(true);
        setError(null);
        setSuccessMessage(null);

        try {
            // Mock API call with setTimeout to simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock validation
            if (friendRequest.trim().toLowerCase() === 'invaliduser') {
                throw new Error('User not found');
            }

            if (friendRequest.trim().toLowerCase() === 'existingfriend') {
                throw new Error('You are already friends with this user');
            }

            // Mock successful response
            setSuccessMessage(`Friend request sent to ${friendRequest}!`);
            
            // Clear input and hide form
            setFriendRequest("");
            setShowAddFriend(false);

            setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsSending(false);
        }
    };

    const handleCancelRequest = async (requestId) => {
        try {
            // Mock API call with setTimeout to simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Remove the request from the list
            setSentRequests(prev => prev.filter(request => request.id !== requestId));
            setSuccessMessage("Friend request cancelled");
            
            setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
        } catch (err) {
            setError("Failed to cancel friend request");
        }
    };

    const filteredFriends = friends.filter(friend =>
        friend.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        friend.petName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const LayoutComponent = isMobile ? MobileLayout : Layout;

    return (
        <LayoutComponent userName="User">
            <div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-200 flex flex-col">
                <main className="flex-1 container mx-auto px-4 py-6 relative">
                    {/* Page Content */}
                    <div className="relative z-10">
                        {/* Header and Search */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                            <h1 className="text-3xl font-sniglet text-[#486085] mb-4 md:mb-0">My Friends</h1>

                            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                {/* Search Bar */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search friends..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2.5 rounded-full border-2 border-[#4abe9c] bg-white focus:outline-none focus:ring-2 focus:ring-[#4abe9c] w-full sm:w-64 shadow-sm"
                                    />
                                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4abe9c]" />
                                </div>

                                {/* Add Friend Button */}
                                <button
                                    onClick={() => setShowAddFriend(!showAddFriend)}
                                    className="bg-[#4abe9c] text-white px-5 py-2.5 rounded-full flex items-center justify-center gap-2 hover:bg-[#3a9880] transition-colors shadow-sm"
                                >
                                    <UserPlus size={18} />
                                    <span>Add Friend</span>
                                </button>
                            </div>
                        </div>

                        {/* Error and Success Messages */}
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                                <span className="block sm:inline">{error}</span>
                                <button 
                                    className="absolute top-0 bottom-0 right-0 px-4 py-3"
                                    onClick={() => setError(null)}
                                >
                                    <span className="sr-only">Dismiss</span>
                                    <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <title>Close</title>
                                        <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                                    </svg>
                                </button>
                            </div>
                        )}

                        {successMessage && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                                <span className="block sm:inline">{successMessage}</span>
                                <button 
                                    className="absolute top-0 bottom-0 right-0 px-4 py-3"
                                    onClick={() => setSuccessMessage(null)}
                                >
                                    <span className="sr-only">Dismiss</span>
                                    <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <title>Close</title>
                                        <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                                    </svg>
                                </button>
                            </div>
                        )}

                        {/* Add Friend Form */}
                        {showAddFriend && (
                            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 mb-8 shadow-md border border-[#4abe9c]/20">
                                <h2 className="text-lg font-sniglet mb-4 text-[#486085]">Add a New Friend</h2>
                                <form onSubmit={handleAddFriend} className="flex gap-3">
                                    <input
                                        type="text"
                                        placeholder="Enter username or email"
                                        value={friendRequest}
                                        onChange={(e) => setFriendRequest(e.target.value)}
                                        className="flex-1 px-4 py-2.5 rounded-lg border-2 border-[#4abe9c] focus:outline-none focus:ring-2 focus:ring-[#4abe9c] bg-white"
                                        disabled={isSending}
                                    />
                                    <button
                                        type="submit"
                                        className={`bg-[#4abe9c] text-white px-6 py-2.5 rounded-lg transition-colors ${
                                            isSending ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#3a9880]'
                                        }`}
                                        disabled={isSending}
                                    >
                                        {isSending ? 'Sending...' : 'Send Request'}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Tabs */}
                        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-md border border-[#4abe9c]/20 overflow-hidden">
                            {/* Tab Navigation */}
                            <div className="flex border-b border-gray-200">
                                <button
                                    onClick={() => setActiveTab('friends')}
                                    className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                                        activeTab === 'friends'
                                            ? 'text-[#4abe9c] border-b-2 border-[#4abe9c]'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    Friends List
                                </button>
                                <button
                                    onClick={() => setActiveTab('requests')}
                                    className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                                        activeTab === 'requests'
                                            ? 'text-[#4abe9c] border-b-2 border-[#4abe9c]'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    Sent Requests
                                </button>
                            </div>

                            {/* Tab Content */}
                            <div className="p-6">
                                {activeTab === 'friends' ? (
                                    // Friends List Content
                                    <div>
                                        {isLoading ? (
                                            <div className="flex justify-center my-12">
                                                <div className="text-xl text-gray-600">Loading friends...</div>
                                            </div>
                                        ) : filteredFriends.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {filteredFriends.map(friend => (
                                                    <div key={friend.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                                                        <div className="flex gap-4">
                                                            {/* Avatar */}
                                                            <div className="w-16 h-16 rounded-full border-2 border-[#4abe9c] overflow-hidden shadow-sm">
                                                                <img
                                                                    src={friend.avatar}
                                                                    alt={`${friend.username}'s avatar`}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>

                                                            {/* User Info */}
                                                            <div className="flex-1">
                                                                <div className="flex justify-between">
                                                                    <h3 className="text-lg text-[#486085] font-medium">{friend.username}</h3>
                                                                    <span className="text-xs text-gray-500">{friend.lastActive}</span>
                                                                </div>
                                                                <p className="text-sm text-[#4abe9c] mt-1">
                                                                    {friend.petName} the {friend.petType}
                                                                </p>
                                                                <div className="flex gap-4 mt-3 text-xs text-gray-600">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <Award size={14} className="text-purple-500" />
                                                                        <span>Level {friend.petLevel}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1.5">
                                                                        <Heart size={14} className="text-red-500" />
                                                                        <span>{friend.streak} day streak</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="flex justify-between mt-4 pt-3 border-t border-gray-100">
                                                            <Link
                                                                to={`/profile/${friend.id}`}
                                                                className="text-[#486085] hover:text-[#31415e] text-sm font-medium hover:underline transition-colors"
                                                            >
                                                                View Profile
                                                            </Link>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <h3 className="text-xl text-[#486085] mb-3">No friends found</h3>
                                                {searchTerm ? (
                                                    <p className="text-gray-600">No results match your search. Try different keywords.</p>
                                                ) : (
                                                    <p className="text-gray-600">You haven't added any friends yet. Use the Add Friend button to get started!</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    // Sent Requests Content
                                    <div>
                                        {sentRequests.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {sentRequests.map(request => (
                                                    <div key={request.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                                                        <div className="flex gap-4">
                                                            {/* Avatar */}
                                                            <div className="w-16 h-16 rounded-full border-2 border-[#4abe9c] overflow-hidden shadow-sm">
                                                                <img
                                                                    src={request.avatar}
                                                                    alt={`${request.username}'s avatar`}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>

                                                            {/* User Info */}
                                                            <div className="flex-1">
                                                                <div className="flex justify-between">
                                                                    <h3 className="text-lg text-[#486085] font-medium">{request.username}</h3>
                                                                    <span className="text-xs text-gray-500">{request.sentAt}</span>
                                                                </div>
                                                                <p className="text-sm text-[#4abe9c] mt-1">
                                                                    {request.petName} the {request.petType}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="flex justify-end mt-4 pt-3 border-t border-gray-100">
                                                            <button
                                                                onClick={() => handleCancelRequest(request.id)}
                                                                className="text-red-500 hover:text-red-600 text-sm font-medium hover:underline transition-colors"
                                                            >
                                                                Cancel Request
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <h3 className="text-xl text-[#486085] mb-3">No Sent Requests</h3>
                                                <p className="text-gray-600">You haven't sent any friend requests yet.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </LayoutComponent>
    );
}
