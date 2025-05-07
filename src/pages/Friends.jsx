import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";
import { UserPlus, Search, MessageSquare, Award, Heart } from "lucide-react";

export default function FriendsPage() {
    const [friends, setFriends] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddFriend, setShowAddFriend] = useState(false);
    const [friendRequest, setFriendRequest] = useState("");

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

    const handleAddFriend = (e) => {
        e.preventDefault();
        if (!friendRequest.trim()) return;

        // In a real app, this would send a friend request
        console.log(`Sending friend request to: ${friendRequest}`);

        // Clear input and hide form
        setFriendRequest("");
        setShowAddFriend(false);

        // Show success message (could use a toast notification in a real app)
        alert(`Friend request sent to ${friendRequest}!`);
    };

    const filteredFriends = friends.filter(friend =>
        friend.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        friend.petName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-200 flex flex-col">
            <NavBar />

            <main className="flex-1 container mx-auto px-4 py-6 relative">
                {/* Page Content */}
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <h1 className="text-3xl font-sniglet text-[#486085] mb-4 md:mb-0">My Friends</h1>

                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            {/* Search Bar */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search friends..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4abe9c] w-full sm:w-64"
                                />
                                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>

                            {/* Add Friend Button */}
                            <button
                                onClick={() => setShowAddFriend(!showAddFriend)}
                                className="bg-[#4abe9c] text-white px-4 py-2 rounded-full flex items-center justify-center gap-2 hover:bg-[#3a9880] transition-colors"
                            >
                                <UserPlus size={18} />
                                <span>Add Friend</span>
                            </button>
                        </div>
                    </div>

                    {/* Add Friend Form */}
                    {showAddFriend && (
                        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 mb-6 shadow-sm border border-[#4abe9c]/20">
                            <h2 className="text-lg font-sniglet mb-3 text-[#486085]">Add a New Friend</h2>
                            <form onSubmit={handleAddFriend} className="flex gap-3">
                                <input
                                    type="text"
                                    placeholder="Enter username or email"
                                    value={friendRequest}
                                    onChange={(e) => setFriendRequest(e.target.value)}
                                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4abe9c]"
                                />
                                <button
                                    type="submit"
                                    className="bg-[#4abe9c] text-white px-4 py-2 rounded-lg"
                                >
                                    Send Request
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Friends List */}
                    {isLoading ? (
                        <div className="flex justify-center my-12">
                            <div className="text-xl text-gray-600">Loading friends...</div>
                        </div>
                    ) : filteredFriends.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredFriends.map(friend => (
                                <div key={friend.id} className="bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-[#4abe9c]/20 hover:shadow-md transition-shadow">
                                    <div className="flex gap-4">
                                        {/* Avatar */}
                                        <div className="w-16 h-16 rounded-full border-2 border-[#4abe9c] overflow-hidden">
                                            <img
                                                src={friend.avatar}
                                                alt={`${friend.username}'s avatar`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* User Info */}
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <h3 className="text-lg font-bold text-[#486085]">{friend.username}</h3>
                                                <span className="text-xs text-gray-500">{friend.lastActive}</span>
                                            </div>
                                            <p className="text-sm text-[#4abe9c]">
                                                {friend.petName} the {friend.petType}
                                            </p>
                                            <div className="flex gap-4 mt-2 text-xs text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <Award size={14} className="text-purple-500" />
                                                    <span>Level {friend.petLevel}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
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
                                            className="text-[#486085] hover:text-[#31415e] text-sm"
                                        >
                                            View Profile
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 text-center my-12">
                            <h3 className="text-xl text-[#486085] mb-2">No friends found</h3>
                            {searchTerm ? (
                                <p className="text-gray-600">No results match your search. Try different keywords.</p>
                            ) : (
                                <p className="text-gray-600">You haven't added any friends yet. Use the Add Friend button to get started!</p>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}