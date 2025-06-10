import { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import MobileLayout from "../components/layout/MobileLayout";
import { Link } from "react-router-dom";
import { UserPlus, Search, MessageSquare, Award, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

function formatDateOnly(value) {
  if (!value) return '';
  const d = new Date(value);
  if (!isNaN(d)) {
    return d.toLocaleDateString();
  }
  return value;
}

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
    const [userProfile, setUserProfile] = useState(null);
    const navigate = useNavigate();
    const [incomingRequests, setIncomingRequests] = useState([]);
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

    // Fetch user profile data
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/profile`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        navigate('/login');
                        return;
                    }
                    throw new Error("Failed to fetch profile data");
                }

                const { data } = await response.json();
                setUserProfile(data);
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError(err.message);
            }
        };

        fetchProfileData();
    }, [navigate]);

    const fetchFriendsData = async () => {
        setIsLoading(true);
        try {
            // Friends list
            const friendsRes = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/friends/list`, {
                credentials: "include",
            });
            const friendsData = friendsRes.ok ? await friendsRes.json() : [];

            // Incoming friend requests
            const incomingRes = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/friends/requests`, {
                credentials: "include",
            });
            const incomingData = incomingRes.ok ? await incomingRes.json() : [];

            // Sent friend requests
            const sentRes = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/friends/sent`, {
                credentials: "include",
            });
            const sentData = sentRes.ok ? await sentRes.json() : [];

            setFriends(friendsData || []);
            console.log("Fetched friends:", friendsData);
            setIncomingRequests(Array.isArray(incomingData.requests) ? incomingData.requests : []);
            setSentRequests(Array.isArray(sentData) ? sentData : []);
        } catch (err) {
            setError("Failed to fetch friends data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFriendsData();
    }, []);

    useEffect(() => {
        async function fetchIncomingRequests() {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/friends/requests`, {
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    setIncomingRequests(Array.isArray(data.requests) ? data.requests : []);
                }
            } catch (error) {
                console.error("Error fetching requests:", error);
            }
        }
        fetchIncomingRequests();
    }, []);

    const handleAddFriend = async (e) => {
        e.preventDefault();
        if (!friendRequest.trim()) return;

        setIsSending(true);
        setError(null);
        setSuccessMessage(null);

        try {
            // Look up the friend’s user id by username/email
            const res = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/users/lookup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ query: friendRequest })
            });
            const lookup = await res.json();
            if (!res.ok || !lookup.user) {
                throw new Error(lookup.message || "User not found");
            }

            // Send the friend request
            const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/friends/request`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ friend_id: lookup.user.id })
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || "Failed to send friend request");
            }
            setSuccessMessage(`Friend request sent to ${lookup.user.display_name}!`);
            setFriendRequest("");
            setShowAddFriend(false);
            setTimeout(() => setSuccessMessage(null), 3000);
            fetchFriendsData();
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
            fetchFriendsData();
        } catch (err) {
            setError("Failed to cancel friend request");
        }
    };

    async function handleAccept(requestId, fromUserId) {
        try {
            // Send API request to accept the friend
            const res = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/friends/accept`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ friend_id: fromUserId }),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Failed to accept friend request");

            // Remove from incoming requests
            setIncomingRequests(prev =>
            prev.filter(req => req.id !== requestId)
            );

            const acceptedRequest = incomingRequests.find(req => req.id === requestId);
            if (acceptedRequest) {
            setFriends(prev => [
                ...prev,
                {
                id: acceptedRequest.fromUserId,
                username: acceptedRequest.username,
                petName: acceptedRequest.petName,
                petType: acceptedRequest.petType,
                petLevel: acceptedRequest.petLevel,
                streak: acceptedRequest.streak,
                lastActive: "Just now",
                avatar: acceptedRequest.avatar_url,
                }
            ]);
            }
            setSuccessMessage("Friend added!");
            fetchFriendsData();
            setTimeout(() => setSuccessMessage(null), 2000);
        } catch (err) {
            setError(err.message);
        }
    }
    async function handleReject(requestId) {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/friends/reject`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ request_id: requestId }),
            });
            if (res.ok) {
                setIncomingRequests(prev => prev.filter(r => r.id !== requestId));
            }
            fetchFriendsData();
        } catch (error) {
            console.error("Error handling reject:", error);
        }
    }

    const filteredFriends = friends.filter(friend =>
        friend.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        friend.petName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const LayoutComponent = isMobile ? MobileLayout : Layout;

    return (
        <LayoutComponent userName={userProfile?.user?.display_name || "User"}>
            <div className="min-h-screen font-sniglet pt-12 pb-8 px-4 sm:px-6 bg-gradient-to-b from-[#eaf6f0] to-[#fdfbef]">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl text-[#486085] font-medium mb-4">My Friends</h1>
                        <div className="flex flex-col sm:flex-row justify-center gap-3">
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

                    {/* Main Content */}
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
                                onClick={() => setActiveTab('incoming')}
                                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                                    activeTab === 'incoming'
                                        ? 'text-[#4abe9c] border-b-2 border-[#4abe9c]'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Incoming Requests
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
                        <div className="p-6 min-h-[400px]">
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
                                                <div
                                                    key={friend.id}
                                                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer"
                                                    onClick={() => navigate(`/profile/${friend.id}`)}
                                                >
                                                    <div className="flex gap-3">
                                                        {/* Avatar */}
                                                        <div className="w-14 h-14 rounded-full border-2 border-[#4abe9c] overflow-hidden shadow-sm flex-shrink-0">
                                                            <img
                                                            src={friend.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${friend.username}`}
                                                            alt={`${friend.username}'s avatar`}
                                                            className="w-full h-full object-cover"
                                                            />
                                                        </div>

                                                        {/* User Info */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between items-start gap-3">
                                                                <h3 className="text-base text-[#486085] font-medium truncate">{friend.username}</h3>
                                                                <span className="text-xs text-gray-500 whitespace-nowrap">{formatDateOnly(friend.lastActive)}</span>
                                                            </div>
                                                            <p className="text-sm text-[#4abe9c] mt-1">
                                                                {friend.petName} the {friend.petType}
                                                            </p>
                                                            <div className="flex gap-4 mt-2 text-xs text-gray-600">
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
                            ) : activeTab === 'incoming' ? (
                                // Incoming Requests Content
                                <div>
                                    {incomingRequests.length === 0 ? (
                                        <div className="text-center py-8">
                                            <h3 className="text-xl text-[#486085] mb-3">No Incoming Requests</h3>
                                            <p className="text-gray-600">No one has sent you a friend request yet.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {incomingRequests.map(req => (
                                                <div
                                                    key={req.id}
                                                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer"
                                                    onClick={() => navigate(`/profile/${req.from_user_id}`)}
                                                >
                                                    <div className="flex gap-3 items-center">
                                                        <div className="w-14 h-14 rounded-full border-2 border-[#4abe9c] overflow-hidden shadow-sm flex-shrink-0">
                                                            <img
                                                                src={req.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${req.username}`}
                                                                alt={`${req.username}'s avatar`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-base text-[#486085] font-medium truncate">{req.username}</h3>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end gap-3 mt-3 pt-3 border-t border-gray-100">
                                                        <button
                                                            onClick={() => handleAccept(req.id, req.from_user_id)}
                                                            className="bg-[#4abe9c] text-white px-4 py-2 rounded-lg hover:bg-[#3a9880] transition-colors"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(req.id)}
                                                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                // Sent Requests Content
                                <div>
                                    {sentRequests.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {sentRequests.map(request => (
                                                <div
                                                    key={request.id}
                                                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer"
                                                    onClick={() => navigate(`/profile/${request.userId}`)}
                                                >
                                                    <div className="flex gap-3">
                                                        {/* Avatar */}
                                                        <div className="w-14 h-14 rounded-full border-2 border-[#4abe9c] overflow-hidden shadow-sm flex-shrink-0">
                                                            <img
                                                                src={request.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${request.username}`}
                                                                alt={`${request.username}'s avatar`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>

                                                        {/* User Info */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between items-start gap-3">
                                                                <h3 className="text-base text-[#486085] font-medium truncate">{request.username}</h3>
                                                                <span className="text-xs text-gray-500 whitespace-nowrap">{formatDateOnly(request.sentAt)}</span>
                                                            </div>
                                                            <p className="text-sm text-[#4abe9c] mt-1">
                                                                {request.petName} the {request.petType}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex justify-end mt-3 pt-3 border-t border-gray-100">
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
            </div>
        </LayoutComponent>
    );
}
