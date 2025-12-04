import FeedPostCard from "../components/FeedPostCard";

const posts = [
  {
    id: 1,
    status: "LOST",
    title: "Brown Leather Wallet",
    description: "Classic bifold wallet containing ID and several credit cards.",
    date: "May 20, 2024",
    location: "Downtown Metro Station",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCFWBlUYwylBIMsGBsdXbtwnEJnKEt6VcNVMxTn30-TSPlEKPyqUrJVSEYrmLJp7Loy_EovNQLzlxW9HheJe_CwAGcnyrboNRfvFQLZ1uDNrTDmwleiYOlpui0IoWmkmpn0JKy8hEhX0YgwIagZgsBad2YM7o6SpuK3C3QlWg1dt75930mnK6oiXKJsXs4Ry9bIorh2ESWReauzdGuWm6FeUrz5l_H2mXTGNyU_5EizEjUrPfZOEzHfN5I1ta7e4nw8YkkBcNVoTvc",
  },
  {
    id: 2,
    status: "FOUND",
    title: "Golden Retriever Puppy",
    description: "Friendly puppy found wandering with a red collar, no tags.",
    date: "May 19, 2024",
    location: "Oakwood Park",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAEfgD9PnSd-VSwtpcD7u8m6yuHZaOhb16bKJRmjhlxy-bMBn6ERYc3JoboH-_tNu9r_25Fzxht02Pl87RorSCqwwEUGng4DFzB7FBvbWvwiznITmWtjEmymswmZjQfVn5Xs4T5PVvmxEk-XgQ8_0CMmTWIPUMolJczXVHzvHioUZ_kDZMUWzdTCC_b5cOA5I841DI2mfaZUmc4xSCUcldUjq759nsuDCujaT7xFH5u-W55q1WZcy9biwTnt0giNU5WqE_yturTsmE",
  },
  {
    id: 3,
    status: "LOST",
    title: "DJI Mini 3 Pro Drone",
    description:
      "Last seen flying near the university campus. Has custom decals.",
    date: "May 18, 2024",
    location: "University Campus",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD1zdS2P83cZ2U1YPVBkObHH0lOhShITxP2kfxCqKw94CJynZ6mQO61WviPr7P38RPR5w7DqnDRTMftnjQqfQnVcBgwGeKgs90CgWcXmhTIJrShxjXOe6wyo-QEUSzDYls5EkygsgzSk40j9Zr8q1Z5vU755fiabeIdftbO-WjmQhLGi6obfjaZwaS_ZqzJRxO415Qngso06TPs-K8rzgDs3l07GHmTFwyxVENU5TasHtGfzBCkMMsxku2A2NoN8hB41lBVrSvee_o",
  },
  {
    id: 4,
    status: "FOUND",
    title: "Set of Car Keys",
    description: "Found on a bench. Has a small cat keychain attached to it.",
    date: "May 17, 2024",
    location: "Central Library Entrance",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBjwtCvZ4JYVM5C6f1xE-69CvdFJ5DXLrAFx7FzxeeHJVZH2XlwmPd6u5iFNiqKH5wivSO9lRPLqJETnZqq-q-RFxWFiaekpGOhaKuHxFdiWADXnCIWpzR8R1FWpBLIf8Dj7amh7lCXFefA8-MWjAUD6m_xu-hWS2Lihxc2satWBxAJsAzvTK5Q6J8y9-uIsOP9F2mmUzzKYSsprDtUcv8VRRM_OwCaJvnSjoXl1_iQG8NWlUqBWVPAdv-3KqUdx-7MWsEV-DFj4L4",
  },
  {
    id: 5,
    status: "LOST",
    title: "Silver Wristwatch",
    description: "Men's watch with a metal strap. Has sentimental value.",
    date: "May 16, 2024",
    location: "City Hall",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBZcWKTSRYzPSunTO_Am6hYDvC9EruW9K7sbR7ppPKDcoNzdEHbM2VaRX5ArhPkSuS8srcNYsEufnhOdTs4tF1vkYk8BGKZxgET_XBM7StsR3p8M2SAkl7m7_cqjND0hFAaAVeS5JxnLx186kgBBHD-I337GLPKdO2GigKgxNjlfFxP7ycsRd2pe09PFZAesJstMmDPMNRwXXCXbZTwFlUlQk_56ZYMUuBYg__PWiRQsMAKfch6plcMBTturUYTo4041tR8rUoDtNo",
  },
  {
    id: 6,
    status: "FOUND",
    title: "Black Backpack",
    description: "Herschel backpack left on the bus. Contains textbooks.",
    date: "May 15, 2024",
    location: "Bus Route 5",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCJZHPBUVo5QDaOWP0Xox1wkooUhg0sA5X5HSy-cLJoLDFuZTV7XRM08c3Nxh7ukqbsqX2m8CagC6w3nCpDirwXCW3pQJHT2FrYT5fCtji2rDVOv87V6f7BssYHEUEaom1VHy3JMFlSiYDd3xLYe2WDDIRhE0MajSdLBbNWNhSt9KCVJoaQwvq8SyqGodRQZUcxOjZn3Q2bNCHKjsDq1AMAcCnE9j2tsY4WR1mEu9EUYoYP5V_f83_c62s-iGbOFzdCPDCcymO5hfI",
  },
  {
    id: 7,
    status: "LOST",
    title: "Wireless Earbuds",
    description: "White earbuds in a charging case. Left at the gym.",
    date: "May 14, 2024",
    location: "Fitness Center",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCFU_lwUADS-6sYtn6_l49Aapf3vl65pTTNhKlVoT8VD8qQrG9bOZr8ohQAYxz3stU0O1GXkx57mMPS8FCz6hUMiTdjXpvG0C9slHFS5XN7DxFHFUZ8QwUZ-5qQlCqwx_s4vkuGNeStxdzXkWwtneDcx4seFqfAKHjc1eEMNq7bylSXaUpUy-aiJA78pTihG_j47UMvCt3sWR6d6UqOSnqfuZcBg6Q30vARGe3DT5RP4Gj5yVzDdUNUgc6z88fZev4lw9ZjRvZoKHQ",
  },
  {
    id: 8,
    status: "FOUND",
    title: "Prescription Glasses",
    description: "Black-rimmed glasses found in the cinema after a movie.",
    date: "May 13, 2024",
    location: "Cineplex Theater 4",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB-B2OXg5HD7h9dS_459SYGOUXeAfDQ7CAtO2VXLXNZn6xaWagRSWbPVqME4YtbASAx8IVCXc0vKkv-1kMt1yuSK0cG3A4-bPxC33D9o3vIET8wR1EeoS_ni2_6uJ1ANp9yUX8z0Vxhem9U7r0iRRGFg1LI0HhlnFJja_UM2zcxe00-mseNpydahI6nN8MxO-3o1K5ftkgykYUac3VKMy5s3JKFguAC8T8z4GjTDigFHqUGSbBuCaQssIAxRQedMkmvi5YVjoggptE",
  },
];

function Feed() {
  return (
    <main className="feed-page">
      <section className="feed-header">
        <h1>All Posts Feed</h1>
        <p>Browse the latest lost and found items from our community.</p>
      </section>

      <section className="feed-filters">
        <div className="feed-search">
          <i className="fa-solid fa-magnifying-glass" />
          <input
            type="search"
            placeholder="Search by item, description..."
            aria-label="Search posts"
          />
        </div>

        <div className="feed-filter-row">
          <select>
            <option>All Categories</option>
            <option>Electronics</option>
            <option>Keys &amp; Wallets</option>
            <option>Bags</option>
            <option>Apparel</option>
            <option>Pets</option>
            <option>Other</option>
          </select>

          <input type="date" />

          <button type="button" className="feed-location-btn">
            <i className="fa-solid fa-location-dot" />
            <span>Location</span>
          </button>
        </div>
      </section>

      <section className="feed-grid">
        {posts.map((post) => (
          <FeedPostCard key={post.id} post={post} />
        ))}
      </section>

      <div className="feed-load-more">
        <button type="button">
          <i className="fa-solid fa-arrows-rotate" />
          <span>Loading more...</span>
        </button>
      </div>
    </main>
  );
}

export default Feed;





