import { useState, useEffect } from "react";
import FeedPostCard from "../components/FeedPostCard";

function Feed({ type }) {
  const [items, setItems] = useState([
    {
      id: 1,
      title: "Lost iPhone 13 Pro",
      description: "Left it on a bench in Central Park near the fountain...",
      location: "Central Park, NY",
      date: "2023-10-25",
      type: "lost",
      image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      title: "Found Golden Retriever",
      description: "Found wandering near 5th Ave. Very friendly, has a red collar...",
      location: "5th Ave, NY",
      date: "2023-10-26",
      type: "found",
      image: "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      title: "Lost Leather Wallet",
      description: "Brown leather wallet lost in the subway. Contains ID and cards...",
      location: "Subway Station, Brooklyn",
      date: "2023-10-24",
      type: "lost",
      image: "https://images.unsplash.com/photo-1627123424574-181ce5171c98?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 4,
      title: "Found Blue Backpack",
      description: "Found a blue Nike backpack at the library entrance...",
      location: "Public Library",
      date: "2023-10-27",
      type: "found",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
  ]);

  const [filteredItems, setFilteredItems] = useState(items);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let result = items;
    
    // Filter by type (lost/found) if prop is provided
    if (type) {
        result = result.filter(item => item.type === type);
    }

    // Filter by search term
    if (searchTerm) {
        result = result.filter(item => 
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    setFilteredItems(result);
  }, [type, searchTerm, items]);


  const getPageTitle = () => {
      if (type === 'lost') return 'Lost Items';
      if (type === 'found') return 'Found Items';
      return 'All Items';
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-navy">{getPageTitle()}</h1>
            <p className="text-slate text-sm mt-1">
              Browsing {filteredItems.length} {type ? type : ''} items in your area
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-96 relative">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-3.5 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search by keyword or location..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <FeedPostCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <i className="fa-solid fa-box-open text-2xl"></i>
            </div>
            <h3 className="text-lg font-bold text-navy mb-2">No items found</h3>
            <p className="text-slate">Try adjusting your search terms or filters.</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default Feed;
