"use client";

import { useState, useEffect } from "react";

const INITIAL_PRODUCTS = [
  {
    id: "iphone-15-pro-max",
    title: "iPhone 15 Pro Max",
    shortDescription: "Titanium design, A17 Pro chip, powerful camera system.",
    description: "Experience the ultimate iPhone with a strong and lightweight aerospace-grade titanium design. Powered by the groundbreaking A17 Pro chip, customizable Action button, and the most powerful iPhone camera system ever with 5x optical zoom.",
    price: 1199,
    category: "Phones",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
    specs: {
      "Display": "6.7-inch Super Retina XDR OLED",
      "Processor": "A17 Pro Chip",
      "Camera": "48MP Main | 12MP Ultra Wide | 12MP Telephoto",
      "Storage": "256GB / 512GB / 1TB"
    }
  },
  {
    id: "macbook-pro-m3",
    title: "MacBook Pro 14\" M3",
    shortDescription: "Stunning Liquid Retina XDR display, blazing fast M3 chip.",
    description: "The 14-inch MacBook Pro blasts forward with the M3 chip, an incredibly advanced processor that brings massive speed and capability. With industry-leading battery life up to 22 hours and a beautiful Liquid Retina XDR display, it's a pro laptop without equal.",
    price: 1599,
    category: "Laptops",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
    specs: {
      "Display": "14.2-inch Liquid Retina XDR",
      "Processor": "Apple M3 Chip",
      "RAM": "8GB / 16GB / 24GB Unified Memory",
      "Battery": "Up to 22 Hours"
    }
  },
  {
    id: "sony-wh-1000xm5",
    title: "Sony WH-1000XM5 Headphones",
    shortDescription: "Industry-leading noise canceling and premium wireless audio.",
    description: "Rewriting the rules for distraction-free listening. Sony WH-1000XM5 wireless headphones feature industry-leading noise cancellation with 8 microphones, exceptional sound quality with the new Integrated Processor V1, and crystal-clear hands-free calling.",
    price: 399,
    category: "Audio",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    specs: {
      "Type": "Over-Ear Wireless",
      "Battery Life": "Up to 30 Hours",
      "Noise Cancelling": "Industry-leading Auto NC Optimizer",
      "Connectivity": "Bluetooth 5.2 | Multi-point"
    }
  },
  {
    id: "ipad-pro-m4",
    title: "iPad Pro 11\" M4",
    shortDescription: "Impossibly thin design with Tandem OLED and M4 performance.",
    description: "The all-new iPad Pro is impossibly thin, featuring outrageous performance with the next-generation Apple M4 chip, a breakthrough Ultra Retina XDR display with state-of-the-art Tandem OLED technology, and superfast Wi-Fi 6E.",
    price: 999,
    category: "Tablets",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
    specs: {
      "Display": "11-inch Ultra Retina XDR (Tandem OLED)",
      "Processor": "Apple M4 Chip",
      "Storage": "256GB to 2TB",
      "Thickness": "5.3 mm"
    }
  },
  {
    id: "apple-watch-ultra-2",
    title: "Apple Watch Ultra 2",
    shortDescription: "The ultimate sports and adventure watch, rugged and capable.",
    description: "The most rugged and capable Apple Watch pushes the limits again. Featuring the all-new S9 SiP, the brightest Always-On Retina display ever, and a magical new way to use your watch without touching the screen with double tap gesture.",
    price: 799,
    category: "Wearables",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600&auto=format&fit=crop&q=80",
    specs: {
      "Case Size": "49mm Titanium Case",
      "Battery Life": "Up to 36 Hours (Normal Use)",
      "Water Resistance": "100m Water Resistant",
      "GPS": "Precision Dual-frequency GPS"
    }
  },
  {
    id: "keychron-q1-pro",
    title: "Keychron Q1 Pro Keyboard",
    shortDescription: "Full metal custom mechanical keyboard with wireless capability.",
    description: "Keychron Q1 Pro is a QMK/VIA wireless custom mechanical keyboard with a full aluminum body. Designed with double-gasket structure, hot-swappable switches, screw-in stabilizers, and south-facing RGB to deliver a premium typing experience.",
    price: 199,
    category: "Accessories",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80",
    specs: {
      "Layout": "75% Layout",
      "Connectivity": "Bluetooth 5.1 & Type-C Wired",
      "Body": "CNC Machined Aluminum",
      "Hot-swappable": "Yes (3-pin & 5-pin MX switches)"
    }
  },
  {
    id: "samsung-s24-ultra",
    title: "Samsung Galaxy S24 Ultra",
    shortDescription: "Galaxy AI is here. Welcome to the era of mobile AI.",
    description: "The new Galaxy S24 Ultra features a tough titanium exterior and a 6.8-inch flat display. It's an absolute marvel of design and the ultimate smartphone for gaming and productivity with the built-in S Pen.",
    price: 1299,
    category: "Phones",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=80",
    specs: {
      "Display": "6.8-inch Dynamic AMOLED 2X",
      "Processor": "Snapdragon 8 Gen 3 for Galaxy",
      "Camera": "200MP Main | 50MP Periscope",
      "Storage": "256GB / 512GB / 1TB"
    }
  },
  {
    id: "dji-mini-4-pro",
    title: "DJI Mini 4 Pro",
    shortDescription: "Mini to the max with omnidirectional active obstacle sensing.",
    description: "DJI Mini 4 Pro is our most advanced mini-camera drone to date. It integrates powerful imaging capabilities, omnidirectional obstacle sensing, and ActiveTrack 360° with the new Trace Mode.",
    price: 759,
    category: "Drones",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=600&auto=format&fit=crop&q=80",
    specs: {
      "Weight": "Under 249 g",
      "Video": "4K/60fps HDR True Vertical Shooting",
      "Flight Time": "Up to 34 minutes",
      "Sensing": "Omnidirectional"
    }
  },
  {
    id: "lg-c3-oled",
    title: "LG C3 55-inch OLED evo TV",
    shortDescription: "Our best-selling OLED TV just got better.",
    description: "The LG OLED evo C-Series is powered by the a9 AI Processor Gen6—made exclusively for LG OLED—for beautiful picture and performance. The Brightness Booster improves brightness so you get luminous picture and high contrast.",
    price: 1499,
    category: "Displays",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&auto=format&fit=crop&q=80",
    specs: {
      "Display": "55-inch OLED evo",
      "Resolution": "4K Ultra HD",
      "Refresh Rate": "120Hz Native",
      "Processor": "a9 AI Processor Gen6"
    }
  },
  {
    id: "logitech-mx-master-3s",
    title: "Logitech MX Master 3S",
    shortDescription: "The iconic mouse, remastered for ultimate tactility.",
    description: "Meet MX Master 3S – an iconic mouse remastered. Feel every moment of your workflow with even more precision, tactility, and performance, thanks to Quiet Clicks and an 8,000 DPI track-on-glass sensor.",
    price: 99,
    category: "Accessories",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=600&auto=format&fit=crop&q=80",
    specs: {
      "Sensor": "8000 DPI Darkfield",
      "Buttons": "7 buttons, Quiet Clicks",
      "Battery": "Up to 70 days",
      "Connectivity": "Bluetooth & Logi Bolt"
    }
  },
  {
    id: "nintendo-switch-oled",
    title: "Nintendo Switch - OLED Model",
    shortDescription: "Play at home or on the go with a vibrant OLED screen.",
    description: "Meet the newest member of the Nintendo Switch family. Play at home on the TV or on-the-go with a vibrant 7-inch OLED screen with the Nintendo Switch – OLED Model system.",
    price: 349,
    category: "Gaming",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=600&auto=format&fit=crop&q=80",
    specs: {
      "Display": "7-inch OLED touch screen",
      "Storage": "64GB Internal",
      "Audio": "Enhanced audio",
      "Stand": "Wide adjustable stand"
    }
  }
];

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("techmarket_products");
    let data = stored ? JSON.parse(stored) : INITIAL_PRODUCTS;
    
    // Auto-update localStorage if it's missing the new products
    if (!stored || data.length < 11) {
      // Merge initial products that might be missing
      const existingIds = new Set(data.map(p => p.id));
      const missingProducts = INITIAL_PRODUCTS.filter(p => !existingIds.has(p.id));
      if (missingProducts.length > 0) {
        data = [...data, ...missingProducts];
        localStorage.setItem("techmarket_products", JSON.stringify(data));
      }
    }

    setTimeout(() => {
      setProducts(data);
      setLoading(false);
    }, 0);
  }, []);

  const addProduct = (newProduct) => {
    const updated = [
      ...products,
      {
        ...newProduct,
        id: newProduct.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        rating: 5.0, // default rating
        specs: newProduct.specs || {
          "Category": newProduct.category,
          "Price": `৳${newProduct.price}`
        }
      }
    ];
    localStorage.setItem("techmarket_products", JSON.stringify(updated));
    setProducts(updated);
  };

  const deleteProduct = (id) => {
    const updated = products.filter((p) => p.id !== id);
    localStorage.setItem("techmarket_products", JSON.stringify(updated));
    setProducts(updated);
  };

  const updateProduct = (id, updatedData) => {
    const updated = products.map((p) => (p.id === id ? { ...p, ...updatedData } : p));
    localStorage.setItem("techmarket_products", JSON.stringify(updated));
    setProducts(updated);
  };

  return { products, loading, addProduct, deleteProduct, updateProduct };
}
