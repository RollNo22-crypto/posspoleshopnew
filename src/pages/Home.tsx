// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import {
//   Heart,
//   Shield,
//   Phone,
//   Zap,
//   Wheat,
//   Car,
//   Cpu,
//   Plane,
//   Leaf,
//   Shirt,
//   Boxes,
//   Factory,
//   ChevronRight,
//   ShoppingCart
// } from 'lucide-react';
// import { supabase } from '../lib/supabase';
// import { Product } from '../types/supabase';
// import { useCart } from '../context/CartContext';
// import { toast } from 'react-hot-toast';

// const verticals = [
//   {
//     title: "Health Care",
//     icon: Heart,
//     description: "Advanced medical solutions and healthcare equipment designed to meet modern healthcare challenges with reliability and performance.",
//     image: "https://images.unsplash.com/photo-1516549655169-df83a0774514",
//     key: "Health Care",
//     subCategories: ["Medical Equipment", "Diagnostic Devices", "Healthcare Solutions", "Patient Care"]
//   },
//   {
//     title: "Defense",
//     icon: Shield,
//     description: "Cutting-edge defense systems and security solutions for modern defense requirements.",
//     image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e",
//     key: "Defense",
//     subCategories: ["Security Systems", "Defense Equipment", "Tactical Solutions", "Protection Gear"]
//   },
//   {
//     title: "Telecom",
//     icon: Phone,
//     description: "Advanced telecommunications infrastructure and solutions for next-generation connectivity.",
//     image: "https://images.unsplash.com/photo-1516387938699-a93567ec168e",
//     key: "Telecom",
//     subCategories: ["Network Infrastructure", "Communication Systems", "Wireless Solutions", "Data Centers"]
//   },
//   {
//     title: "Future Energy",
//     icon: Zap,
//     description: "Innovative energy solutions for a sustainable future, from renewable sources to smart grid technologies.",
//     image: "https://images.unsplash.com/photo-1509391366360-2e959784a276",
//     key: "Future Energy",
//     subCategories: ["Renewable Energy", "Smart Grids", "Energy Storage", "Clean Tech"]
//   },
//   {
//     title: "Agri Food",
//     icon: Wheat,
//     description: "Advanced agricultural and food processing solutions for sustainable food production.",
//     image: "https://fhdcygdjolbkjpsqvflk.supabase.co/storage/v1/object/public/Images//background_liv-lif.jpg",
//     key: "Agri Food",
//     subCategories: ["Farm Technology", "Food Processing", "Smart Agriculture", "Sustainable Solutions"]
//   },
//   {
//     title: "Mobility",
//     icon: Car,
//     description: "Next-generation mobility solutions for efficient and sustainable transportation.",
//     image: "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0",
//     key: "Mobility",
//     subCategories: ["Electric Vehicles", "Smart Transport", "Urban Mobility", "Charging Infrastructure"]
//   },
//   {
//     title: "Electronics",
//     icon: Cpu,
//     description: "Cutting-edge electronic solutions and components for various industrial applications.",
//     image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
//     key: "Electronics",
//     subCategories: ["Circuit Systems", "Electronic Components", "Smart Devices", "Control Systems"]
//   },
//   {
//     title: "Aerospace",
//     icon: Plane,
//     description: "Advanced aerospace technologies and solutions for aviation and space exploration.",
//     image: "https://images.unsplash.com/photo-1517976487492-5750f3195933",
//     key: "Aerospace",
//     subCategories: ["Aircraft Systems", "Space Technology", "Aviation Equipment", "Aerospace Components"]
//   },
//   {
//     title: "Sustainability",
//     icon: Leaf,
//     description: "Eco-friendly solutions and technologies for a sustainable future.",
//     image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e",
//     key: "Sustainability",
//     subCategories: ["Green Technology", "Waste Management", "Eco Solutions", "Sustainable Materials"]
//   },
//   {
//     title: "Fashion",
//     icon: Shirt,
//     description: "Innovative fashion technology and textile solutions for the modern industry.",
//     image: "https://images.unsplash.com/photo-1618090584126-129cd1b2d239",
//     key: "Fashion",
//     subCategories: ["Textile Tech", "Smart Fabrics", "Manufacturing", "Design Solutions"]
//   },
//   {
//     title: "Multitech",
//     icon: Boxes,
//     description: "Integrated multi-technology solutions for diverse industrial applications.",
//     image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789",
//     key: "Multitech",
//     subCategories: ["Integrated Systems", "Multi-platform Solutions", "Tech Integration", "Smart Systems"]
//   },
//   {
//     title: "Manufacturing",
//     icon: Factory,
//     description: "Advanced manufacturing solutions and smart factory technologies.",
//     image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122",
//     key: "Manufacturing",
//     subCategories: ["Smart Factory", "Industrial Automation", "Production Systems", "Quality Control"]
//   }
// ];

// export default function Home() {
//   const [verticalProducts, setVerticalProducts] = useState<Record<string, Product[]>>({});
//   const [loading, setLoading] = useState(true);
//   const { addToCart } = useCart();

//   useEffect(() => {
//     async function fetchProductsByVertical() {
//       try {
//         const promises = verticals.map(async (vertical) => {
//           const { data } = await supabase
//             .from('products')
//             .select('*')
//             .eq('vertical', vertical.key)
//             .order('created_at', { ascending: false })
//             .limit(4);
          
//           return { vertical: vertical.key, products: data || [] };
//         });

//         const results = await Promise.all(promises);
//         const productMap = results.reduce((acc, { vertical, products }) => {
//           acc[vertical] = products;
//           return acc;
//         }, {} as Record<string, Product[]>);

//         setVerticalProducts(productMap);
//       } catch (error) {
//         console.error('Error fetching products:', error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchProductsByVertical();
//   }, []);

//   const handleAddToCart = (product: Product) => {
//     addToCart(product, 1);
//     toast.success('Added to cart');
//   };

//   return (
//     <div className="min-h-screen">
//       {/* Hero Section */}
//         <section className="relative w-full h-[90vh] bg-gray-900 text-white">
//           {/* Background Image */}
//           <div className="absolute inset-0 overflow-hidden">
//             <img
//               src="https://fhdcygdjolbkjpsqvflk.supabase.co/storage/v1/object/public/Images//rsz_1webbanner%20(1).jpg"
//               alt="Industrial Background"
//               className="w-full h-full object-cover"
//             />
//           </div>

//           {/* Centered Fixed-Width Button */}
//           {/* <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 sm:pt-48 lg:pt-56 flex justify-center">
//             <Link
//               to="/verticals"
//               className="bg-cyan-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-cyan-700 transition-colors shadow-lg"
//             >
//               Explore All Verticals
//             </Link>
//           </div> */}

//           {/* Full-Width Bottom Button */}
//           <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
//             <button
//               onClick={() => window.location.href = "/verticals"}
//               className="bg-cyan-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-cyan-700 transition-colors shadow-lg"
//             >
//               Explore All Verticals
//             </button>
//           </div>


//         </section>






//       {/* Verticals Section */}
//       <section className="py-16 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h2 className="text-3xl font-bold text-gray-900 mb-12">Industry Verticals</h2>
          
//           <div className="space-y-8">
//             {verticals.map((vertical) => {
//               const Icon = vertical.icon;
//               const products = verticalProducts[vertical.key] || [];
              
//               return (
//                 <div key={vertical.key} className="bg-white rounded-lg shadow-md overflow-hidden">
//                   <div className="grid grid-cols-1 md:grid-cols-3">
//                     {/* Left Section */}
//                     <div className="relative">
//                       <img
//                         src={vertical.image}
//                         alt={vertical.title}
//                         className="w-full h-full object-cover"
//                         style={{ minHeight: '400px' }}
//                       />
//                       <div className="absolute inset-0 bg-black bg-opacity-40 p-6 flex flex-col justify-between">
//                         <div>
//                           <div className="flex items-center gap-3 mb-4">
//                             <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
//                               <Icon className="w-6 h-6 text-white" />
//                             </div>
//                             <h3 className="text-2xl font-bold text-white">
//                               {vertical.title}
//                             </h3>
//                           </div>
//                           <p className="text-white/90 mb-4">
//                             {vertical.description}
//                           </p>
//                           <ul className="space-y-2">
//                             {vertical.subCategories.map((category, idx) => (
//                               <li key={idx} className="text-white/80 flex items-center">
//                                 <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2"></span>
//                                 {category}
//                               </li>
//                             ))}
//                           </ul>
//                         </div>
//                         <Link
//                           to={`/verticals/${vertical.key}`}
//                           className="inline-flex items-center text-white hover:text-cyan-200 font-medium"
//                         >
//                           View All Products
//                           <ChevronRight className="w-5 h-5 ml-1" />
//                         </Link>
//                       </div>
//                     </div>

//                     {/* Right Section - Recent Products */}
//                     <div className="md:col-span-2 p-6">
//                       <div className="mb-4 flex justify-between items-center">
//                         <h4 className="text-lg font-semibold text-gray-900">Recent Products</h4>
//                         <Link
//                           to={`/verticals/${vertical.key}`}
//                           className="text-cyan-600 hover:text-cyan-700 font-medium text-sm flex items-center"
//                         >
//                           View More
//                           <ChevronRight className="w-4 h-4 ml-1" />
//                         </Link>
//                       </div>

//                       {loading ? (
//                         <div className="flex justify-center py-8">
//                           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
//                         </div>
//                       ) : (
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                           {products.map((product) => (
//                             <div
//                               key={product.id}
//                               className="group block bg-gray-50 rounded-lg overflow-hidden hover:bg-gray-100 transition-colors"
//                             >
//                               <Link to={`/product/${product.slug}`}>
//                                 <div className="aspect-w-16 aspect-h-9">
//                                   <img
//                                     src={product.image_url}
//                                     alt={product.name}
//                                     className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
//                                   />
//                                 </div>
//                               </Link>
//                               <div className="p-4">
//                                 <Link to={`/product/${product.slug}`}>
//                                   <h5 className="font-medium text-gray-900 mb-1 line-clamp-1">
//                                     {product.name}
//                                   </h5>
//                                   <p className="text-sm text-gray-600 line-clamp-2">
//                                     {product.description}
//                                   </p>
//                                 </Link>
//                                 <div className="mt-2 flex justify-between items-center">
//                                   <div className="text-sm text-gray-500">
//                                     {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
//                                   </div>
//                                   <button
//                                     onClick={() => handleAddToCart(product)}
//                                     disabled={product.stock === 0}
//                                     className={`p-2 rounded-full transition-colors ${
//                                       product.stock === 0 
//                                         ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                                         : 'bg-cyan-600 text-white hover:bg-cyan-700'
//                                     }`}
//                                     title={product.stock === 0 ? 'Out of stock' : 'Add to cart'}
//                                   >
//                                     <ShoppingCart className="w-5 h-5" />
//                                   </button>
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product } from '../types/supabase';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';
import { ChevronRight, ShoppingCart } from 'lucide-react';

// Define verticals with custom image URLs for icons
const verticals = [
  {
    title: "Health Care",
    icon: 'https://fhdcygdjolbkjpsqvflk.supabase.co/storage/v1/object/public/Images//health.png', // Replace with your custom image URL
    description: "Advanced medical solutions and healthcare equipment designed to meet modern healthcare challenges with reliability and performance.",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514",
    key: "Health Care",
    subCategories: ["Medical Equipment", "Diagnostic Devices", "Healthcare Solutions", "Patient Care"]
  },
  {
    title: "Agri Food",
    icon: 'https://fhdcygdjolbkjpsqvflk.supabase.co/storage/v1/object/public/Images//food%20and%20agri.png', // Replace with your custom image URL
    description: "Advanced agricultural and food processing solutions for sustainable food production.",
    image: "https://fhdcygdjolbkjpsqvflk.supabase.co/storage/v1/object/public/Images//background_liv-lif.jpg",
    key: "Agri Food",
    subCategories: ["Farm Technology", "Food Processing", "Smart Agriculture", "Sustainable Solutions"]
  },
  {
    title: "Fashion",
    icon: 'https://fhdcygdjolbkjpsqvflk.supabase.co/storage/v1/object/public/Images//fashion.png', // Replace with your custom image URL
    description: "Innovative fashion technology and textile solutions for the modern industry.",
    image: "https://fhdcygdjolbkjpsqvflk.supabase.co/storage/v1/object/public/Images//fashionbanner2.jpg",
    key: "Fashion",
    subCategories: ["Textile Tech", "Smart Fabrics", "Manufacturing", "Design Solutions"]
  },
  {
    title: "Defense",
    icon: 'https://fhdcygdjolbkjpsqvflk.supabase.co/storage/v1/object/public/Images//defense.png', // Replace with your custom image URL
    description: "Cutting-edge defense systems and security solutions for modern defense requirements.",
    image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e",
    key: "Defense",
    subCategories: ["Security Systems", "Defense Equipment", "Tactical Solutions", "Protection Gear"]
  },
  {
    title: "Electronics",
    icon: 'https://fhdcygdjolbkjpsqvflk.supabase.co/storage/v1/object/public/Images//electronics.png', // Replace with your custom image URL
    description: "Cutting-edge electronic solutions and components for various industrial applications.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    key: "Electronics",
    subCategories: ["Circuit Systems", "Electronic Components", "Smart Devices", "Control Systems"]
  },
  {
    title: "Telecom",
    icon: 'https://fhdcygdjolbkjpsqvflk.supabase.co/storage/v1/object/public/Images//telecom.png', // Replace with your custom image URL
    description: "Advanced telecommunications infrastructure and solutions for next-generation connectivity.",
    image: "https://images.unsplash.com/photo-1516387938699-a93567ec168e",
    key: "Telecom",
    subCategories: ["Network Infrastructure", "Communication Systems", "Wireless Solutions", "Data Centers"]
  },
  {
    title: "Future Energy",
    icon: 'https://fhdcygdjolbkjpsqvflk.supabase.co/storage/v1/object/public/Images//Asset%201energy%20logo.png', // Replace with your custom image URL
    description: "Innovative energy solutions for a sustainable future, from renewable sources to smart grid technologies.",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276",
    key: "Future Energy",
    subCategories: ["Renewable Energy", "Smart Grids", "Energy Storage", "Clean Tech"]
  },
  // {
  //   title: "Agri Food",
  //   icon: 'https://fhdcygdjolbkjpsqvflk.supabase.co/storage/v1/object/public/Images//food%20and%20agri.png', // Replace with your custom image URL
  //   description: "Advanced agricultural and food processing solutions for sustainable food production.",
  //   image: "https://fhdcygdjolbkjpsqvflk.supabase.co/storage/v1/object/public/Images//background_liv-lif.jpg",
  //   key: "Agri Food",
  //   subCategories: ["Farm Technology", "Food Processing", "Smart Agriculture", "Sustainable Solutions"]
  // },
  // {
  //   title: "Mobility",
  //   icon: 'https://fhdcygdjolbkjpsqvflk.supabase.co/storage/v1/object/public/Images//mobility.png', // Replace with your custom image URL
  //   description: "Next-generation mobility solutions for efficient and sustainable transportation.",
  //   image: "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0",
  //   key: "Mobility",
  //   subCategories: ["Electric Vehicles", "Smart Transport", "Urban Mobility", "Charging Infrastructure"]
  // },
  // {
  //   title: "Electronics",
  //   icon: 'https://fhdcygdjolbkjpsqvflk.supabase.co/storage/v1/object/public/Images//electronics.png', // Replace with your custom image URL
  //   description: "Cutting-edge electronic solutions and components for various industrial applications.",
  //   image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
  //   key: "Electronics",
  //   subCategories: ["Circuit Systems", "Electronic Components", "Smart Devices", "Control Systems"]
  // },
  // {
  //   title: "Aerospace",
  //   icon: 'https://fhdcygdjolbkjpsqvflk.supabase.co/storage/v1/object/public/Images//aerospace.png', // Replace with your custom image URL
  //   description: "Advanced aerospace technologies and solutions for aviation and space exploration.",
  //   image: "https://images.unsplash.com/photo-1517976487492-5750f3195933",
  //   key: "Aerospace",
  //   subCategories: ["Aircraft Systems", "Space Technology", "Aviation Equipment", "Aerospace Components"]
  // },
  // {
  //   title: "Sustainability",
  //   icon: 'https://fhdcygdjolbkjpsqvflk.supabase.co/storage/v1/object/public/Images//health.png', // Replace with your custom image URL
  //   description: "Eco-friendly solutions and technologies for a sustainable future.",
  //   image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e",
  //   key: "Sustainability",
  //   subCategories: ["Green Technology", "Waste Management", "Eco Solutions", "Sustainable Materials"]
  // },
  // {
  //   title: "Fashion",
  //   icon: 'https://fhdcygdjolbkjpsqvflk.supabase.co/storage/v1/object/public/Images//fashion.png', // Replace with your custom image URL
  //   description: "Innovative fashion technology and textile solutions for the modern industry.",
  //   image: "https://images.unsplash.com/photo-1618090584126-129cd1b2d239",
  //   key: "Fashion",
  //   subCategories: ["Textile Tech", "Smart Fabrics", "Manufacturing", "Design Solutions"]
  // },
  {
    title: "Multitech",
    icon: 'https://fhdcygdjolbkjpsqvflk.supabase.co/storage/v1/object/public/Images//multitech.png', // Replace with your custom image URL
    description: "Integrated multi-technology solutions for diverse industrial applications.",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789",
    key: "Multitech",
    subCategories: ["Integrated Systems", "Multi-platform Solutions", "Tech Integration", "Smart Systems"]
  },
  {
    title: "Manufacturing",
    icon: 'https://fhdcygdjolbkjpsqvflk.supabase.co/storage/v1/object/public/Images//manufacturing%20(1).png', // Replace with your custom image URL
    description: "Advanced manufacturing solutions and smart factory technologies.",
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122",
    key: "Manufacturing",
    subCategories: ["Smart Factory", "Industrial Automation", "Production Systems", "Quality Control"]
  }
];

export default function Home() {
  const [verticalProducts, setVerticalProducts] = useState<Record<string, Product[]>>({});
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProductsByVertical() {
      try {
        const promises = verticals.map(async (vertical) => {
          const { data } = await supabase
            .from('products')
            .select('*')
            .eq('vertical', vertical.key)
            .order('created_at', { ascending: false })
            .limit(4);
          
          return { vertical: vertical.key, products: data || [] };
        });

        const results = await Promise.all(promises);
        const productMap = results.reduce((acc, { vertical, products }) => {
          acc[vertical] = products;
          return acc;
        }, {} as Record<string, Product[]>);

        setVerticalProducts(productMap);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProductsByVertical();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    toast.success('Added to cart');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[90vh] bg-gray-900 text-white">
        {/* Background Image */}
        {/* <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://fhdcygdjolbkjpsqvflk.supabase.co/storage/v1/object/public/Images//rsz_1webbanner%20(1).jpg"
            alt="Industrial Background"
            className="w-full h-full object-cover"
          />
        </div> */}

        {/* Full-Width Bottom Button */}
        {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <button
            onClick={() => window.location.href = "/verticals"}
            className="bg-cyan-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-cyan-700 transition-colors shadow-lg"
          >
            Explore All Verticals
          </button>
        </div> */}
  {/* Background Image with Responsive Variants */}
  <div className="absolute inset-0 overflow-hidden">
    <picture>
      {/* Mobile Image (up to 768px) */}
      <source 
        media="(max-width: 768px)" 
        srcSet="https://fhdcygdjolbkjpsqvflk.supabase.co/storage/v1/object/public/Images//3-4_webbanner-03.jpg"
      />

      {/* Tablet Image (between 768px - 1024px) */}
      <source 
        media="(max-width: 1024px)" 
        srcSet="https://fhdcygdjolbkjpsqvflk.supabase.co/storage/v1/object/public/Images/desktop_webbanner.jpg"
      />

      {/* Desktop Image (default for larger screens) */}
      <img
        src="https://fhdcygdjolbkjpsqvflk.supabase.co/storage/v1/object/public/Images/desktop_webbanner.jpg"
        alt="Industrial Background"
        className="w-full h-full sm:object-cover object-fill"
        loading="lazy"
      />
    </picture>
  </div>

  {/* Full-Width Bottom Button */}
  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
    <button
      onClick={() => window.location.href = "/verticals"}
      className="bg-cyan-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-cyan-700 transition-colors shadow-lg"
    >
      Explore All Verticals
    </button>
  </div>

</section>

      {/* Verticals Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Industry Verticals</h2>
          
          <div className="space-y-8">
            {verticals.map((vertical) => {
              const iconUrl = vertical.icon; // Custom image URL
              const products = verticalProducts[vertical.key] || [];
              
              return (
                <div key={vertical.key} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-3">
                    {/* Left Section */}
                    <div className="relative">
                      <img
                        src={vertical.image}
                        alt={vertical.title}
                        className="w-full h-full object-cover"
                        style={{ minHeight: '400px' }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            {/* <div className="w-30 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center"> */}
                              <img
                                src={iconUrl}
                                alt={`${vertical.title} Icon`}
                                className="w-auto h-6"
                              />
                            {/* </div> */}
                            {/* <h3 className="text-2xl font-bold text-white">
                              {vertical.title}
                            </h3> */}
                          </div>
                          <p className="text-white/90 mb-4">
                            {vertical.description}
                          </p>
                          <ul className="space-y-2">
                            {vertical.subCategories.map((category, idx) => (
                              <li key={idx} className="text-white/80 flex items-center">
                                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2"></span>
                                {category}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <Link
                          to={`/verticals/${vertical.key}`}
                          className="inline-flex items-center text-white hover:text-cyan-200 font-medium"
                        >
                          View All Products
                          <ChevronRight className="w-5 h-5 ml-1" />
                        </Link>
                      </div>
                    </div>

                    {/* Right Section - Recent Products */}
                    <div className="md:col-span-2 p-6">
                      <div className="mb-4 flex justify-between items-center">
                        <h4 className="text-lg font-semibold text-gray-900">Recent Products</h4>
                        <Link
                          to={`/verticals/${vertical.key}`}
                          className="text-cyan-600 hover:text-cyan-700 font-medium text-sm flex items-center"
                        >
                          View More
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                      </div>

                      {loading ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {products.map((product) => (
                            <div
                              key={product.id}
                              className="group block bg-gray-50 rounded-lg overflow-hidden hover:bg-gray-100 transition-colors"
                            >
                              <Link to={`/product/${product.slug}`}>
                                <div className="aspect-w-16 aspect-h-9">
                                  <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                              </Link>
                              <div className="p-4">
                                <Link to={`/product/${product.slug}`}>
                                  <h5 className="font-medium text-gray-900 mb-1 line-clamp-1">
                                    {product.name}
                                  </h5>
                                  <p className="text-sm text-gray-600 line-clamp-2">
                                    {product.description}
                                  </p>
                                </Link>
                                <div className="mt-2 flex justify-between items-center">
                                  <div className="text-sm text-gray-500">
                                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                  </div>
                                  <button
                                    onClick={() => handleAddToCart(product)}
                                    disabled={product.stock === 0}
                                    className={`p-2 rounded-full transition-colors ${
                                      product.stock === 0 
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-cyan-600 text-white hover:bg-cyan-700'
                                    }`}
                                    title={product.stock === 0 ? 'Out of stock' : 'Add to cart'}
                                  >
                                    <ShoppingCart className="w-5 h-5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}