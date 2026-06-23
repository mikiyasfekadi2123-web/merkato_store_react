import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";

const CATEGORIES = [
  "All Products",
  "Electronics",
  "Clothing",
  "Food & Beverage",
  "Home & Living",
];

// Fallback seed data in case your API database table is currently empty
const FALLBACK_PRODUCTS = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    description: "High-quality sound with 20-hour battery life.",
    price: 45.0,
    image: "/images/product1.jpg",
  },
  {
    id: 2,
    name: "Cotton Summer Dress",
    category: "Clothing",
    description:
      "Lightweight and breathable fabric, perfect for warm climates.",
    price: 28.0,
    image: "/images/product2.jpg",
  },
  {
    id: 3,
    name: "Ethiopian Organic Coffee",
    category: "Food & Beverage",
    description: "Premium single-origin coffee from the highlands of Ethiopia.",
    price: 12.0,
    image: "/images/product3.jpg",
  },
];

export default function Products({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/products`)
      .then((r) => r.json())
      .then((data) => {
        // ✅ If the API returns items, use them. If it's an empty array, use fallbacks!
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          console.warn(
            "API returned empty array. Using fallback local products.",
          );
          setProducts(FALLBACK_PRODUCTS);
        }
      })
      .catch((err) => {
        console.error(
          "Network Fetch Error. Using fallback local products.",
          err,
        );
        setProducts(FALLBACK_PRODUCTS);
      });
  }, []);

  function handleCategoryClick(cat) {
    setActiveCategory(cat);
    setSearch("");
  }

  function handleSearchChange(e) {
    setSearch(e.target.value);
    setActiveCategory("All Products");
  }

  const filtered = products.filter((p) => {
    const matchesCategory =
      activeCategory === "All Products" || p.category === activeCategory;
    const term = search.toLowerCase();
    return (
      matchesCategory &&
      (p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term))
    );
  });

  return (
    <div className="max-w-[1200px] mx-auto px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <aside className="w-full md:w-[220px] shrink-0 bg-white border border-[#dddddd] rounded-lg p-4">
          <h3 className="font-bold text-[#1f3864] text-base mb-4 pb-2 border-b-2 border-[#e8b84b]">
            Categories
          </h3>
          <ul className="space-y-1">
            {CATEGORIES.map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => handleCategoryClick(cat)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    activeCategory === cat
                      ? "bg-[#1f3864] text-white"
                      : "text-[#222] hover:bg-[#1f3864] hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={handleSearchChange}
            className="w-full rounded-[24px] border-2 border-[#dddddd] px-4 py-3 text-base focus:outline-none focus:border-[#1f3864] mb-4"
          />

          {filtered.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No products found for "{search}".
            </p>
          ) : (
            <div className="flex flex-wrap gap-4">
              {filtered.map((p) => (
                <div key={p.id} className="flex-[1_1_280px] max-w-[320px]">
                  <ProductCard product={p} addToCart={addToCart} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
