// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { supabase } from '../lib/supabase';
// import { Product } from '../types/supabase';
// import ProductCard from '../components/ProductCard';
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
//   Factory
// } from 'lucide-react';

// const verticalInfo = {
//   "Health Care": {
//     icon: Heart,
//     description: 'Advanced medical solutions and healthcare equipment designed to meet modern healthcare challenges with reliability and performance.',
//     image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514'
//   },
//   "Defense": {
//     icon: Shield,
//     description: 'Cutting-edge defense systems and security solutions for modern defense requirements.',
//     image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e'
//   },
//   "Telecom": {
//     icon: Phone,
//     description: 'Advanced telecommunications infrastructure and solutions for next-generation connectivity.',
//     image: 'https://images.unsplash.com/photo-1516387938699-a93567ec168e'
//   },
//   "Future Energy": {
//     icon: Zap,
//     description: 'Innovative energy solutions for a sustainable future, from renewable sources to smart grid technologies.',
//     image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276'
//   },
//   "Agri Food": {
//     icon: Wheat,
//     description: 'Advanced agricultural and food processing solutions for sustainable food production.',
//     image: 'https://images.unsplash.com/photo-1591261730799-ee4e6c2d16d7'
//   },
//   "Mobility": {
//     icon: Car,
//     description: 'Next-generation mobility solutions for efficient and sustainable transportation.',
//     image: 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0'
//   },
//   "Electronics": {
//     icon: Cpu,
//     description: 'Cutting-edge electronic solutions and components for various industrial applications.',
//     image: 'https://images.unsplash.com/photo-1518770660439-4636190af475'
//   },
//   "Aerospace": {
//     icon: Plane,
//     description: 'Advanced aerospace technologies and solutions for aviation and space exploration.',
//     image: 'https://images.unsplash.com/photo-1517976487492-5750f3195933'
//   },
//   "Sustainability": {
//     icon: Leaf,
//     description: 'Eco-friendly solutions and technologies for a sustainable future.',
//     image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e'
//   },
//   "Fashion": {
//     icon: Shirt,
//     description: 'Innovative fashion technology and textile solutions for the modern industry.',
//     image: 'https://images.unsplash.com/photo-1618090584126-129cd1b2d239'
//   },
//   "Multitech": {
//     icon: Boxes,
//     description: 'Integrated multi-technology solutions for diverse industrial applications.',
//     image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789'
//   },
//   "Manufacturing": {
//     icon: Factory,
//     description: 'Advanced manufacturing solutions and smart factory technologies.',
//     image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122'
//   }
// };

// export default function VerticalPage() {
//   const { vertical } = useParams<{ vertical: string }>();
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const info = vertical ? verticalInfo[vertical as keyof typeof verticalInfo] : null;
//   const Icon = info?.icon;

//   useEffect(() => {
//     async function fetchProducts() {
//       try {
//         const { data, error } = await supabase
//           .from('products')
//           .select('*')
//           .eq('vertical', vertical)
//           .order('created_at', { ascending: false });

//         if (error) throw error;
//         setProducts(data || []);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'An error occurred');
//       } finally {
//         setLoading(false);
//       }
//     }

//     if (vertical) {
//       setLoading(true);
//       fetchProducts();
//     }
//   }, [vertical]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-red-600">Error: {error}</div>
//       </div>
//     );
//   }

//   if (!info) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-red-600">Vertical not found</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Hero Section */}
//       <section className="relative bg-gray-900 text-white py-20">
//         <div className="absolute inset-0 overflow-hidden">
//           <img
//             src={info.image}
//             alt={`${vertical} Background`}
//             className="w-full h-full object-cover opacity-30"
//           />
//         </div>
//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center gap-4 mb-6">
//             {Icon && <Icon className="w-12 h-12" />}
//             <h1 className="text-4xl font-bold">{vertical}</h1>
//           </div>
//           <p className="text-xl max-w-3xl">
//             {info.description}
//           </p>
//         </div>
//       </section>

//       {/* Products Grid */}
//       <section className="py-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {products.length === 0 ? (
//             <div className="text-center py-12">
//               <p className="text-gray-600 text-lg">
//                 No products available in this vertical yet.
//               </p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {products.map((product) => (
//                 <ProductCard key={product.id} {...product} />
//               ))}
//             </div>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// }

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product } from '../types/supabase';
import ProductCard from '../components/ProductCard';

// Define verticalInfo with custom image URLs for icons
const verticalInfo = {
  "Health Care": {
    icon: 'https://fhdcygdjolbkjpsqvflk.supabase.co/storage/v1/object/public/Images//health.png', // Replace with your custom image URL
    description: 'Advanced medical solutions and healthcare equipment designed to meet modern healthcare challenges with reliability and performance.',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514'
  },
  "Defense": {
    icon: 'https://fhdcygdjolbkjpsqvflk.supabase.co/storage/v1/object/public/Images//defense.png', // Replace with your custom image URL
    description: 'Cutting-edge defense systems and security solutions for modern defense requirements.',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e'
  },
  "Telecom": {
    icon: 'https://fhdcygdjolbkjpsqvflk.supabase.co/storage/v1/object/public/Images//telecom.png', // Replace with your custom image URL
    description: 'Advanced telecommunications infrastructure and solutions for next-generation connectivity.',
    image: 'https://images.unsplash.com/photo-1516387938699-a93567ec168e'
  },
  "Future Energy": {
    icon: 'https://fhdcygdjolbkjpsqvflk.supabase.co/storage/v1/object/public/Images//Asset%201energy%20logo.png', // Replace with your custom image URL
    description: 'Innovative energy solutions for a sustainable future, from renewable sources to smart grid technologies.',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276'
  },
  "Agri Food": {
    icon: 'https://fhdcygdjolbkjpsqvflk.supabase.co/storage/v1/object/public/Images//food%20and%20agri.png', // Replace with your custom image URL
    description: 'Advanced agricultural and food processing solutions for sustainable food production.',
    image: 'https://images.unsplash.com/photo-1591261730799-ee4e6c2d16d7'
  },
  "Mobility": {
    icon: 'https://fhdcygdjolbkjpsqvflk.supabase.co/storage/v1/object/public/Images//mobility.png', // Replace with your custom image URL
    description: 'Next-generation mobility solutions for efficient and sustainable transportation.',
    image: 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0'
  },
  "Electronics": {
    icon: 'https://fhdcygdjolbkjpsqvflk.supabase.co/storage/v1/object/public/Images//electronics.png', // Replace with your custom image URL
    description: 'Cutting-edge electronic solutions and components for various industrial applications.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475'
  },
  "Aerospace": {
    icon: 'https://fhdcygdjolbkjpsqvflk.supabase.co/storage/v1/object/public/Images//aerospace.png', // Replace with your custom image URL
    description: 'Advanced aerospace technologies and solutions for aviation and space exploration.',
    image: 'https://images.unsplash.com/photo-1517976487492-5750f3195933'
  },
  "Sustainability": {
    icon: 'https://fhdcygdjolbkjpsqvflk.supabase.co/storage/v1/object/public/Images//health.png', // Replace with your custom image URL
    description: 'Eco-friendly solutions and technologies for a sustainable future.',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e'
  },
  "Fashion": {
    icon: 'https://fhdcygdjolbkjpsqvflk.supabase.co/storage/v1/object/public/Images//fashion.png', // Replace with your custom image URL
    description: 'Innovative fashion technology and textile solutions for the modern industry.',
    image: 'https://fhdcygdjolbkjpsqvflk.supabase.co/storage/v1/object/public/Images//fashionbanner2.jpg'
  },
  "Multitech": {
    icon: 'https://fhdcygdjolbkjpsqvflk.supabase.co/storage/v1/object/public/Images//multitech.png', // Replace with your custom image URL
    description: 'Integrated multi-technology solutions for diverse industrial applications.',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789'
  },
  "Manufacturing": {
    icon: 'https://fhdcygdjolbkjpsqvflk.supabase.co/storage/v1/object/public/Images//manufacturing%20(1).png', // Replace with your custom image URL
    description: 'Advanced manufacturing solutions and smart factory technologies.',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122'
  }
};

export default function VerticalPage() {
  const { vertical } = useParams<{ vertical: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const info = vertical ? verticalInfo[vertical as keyof typeof verticalInfo] : null;
  const iconUrl = info?.icon; // Custom image URL

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('vertical', vertical)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    if (vertical) {
      setLoading(true);
      fetchProducts();
    }
  }, [vertical]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!info) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Vertical not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white py-20">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={info.image}
            alt={`${vertical} Background`}
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            {iconUrl && (
              <img
                src={iconUrl}
                alt={`${vertical} Icon`}
                className="w-auto h-12 "
              />
            )}
            {/* <h1 className="text-4xl font-bold">{vertical}</h1> */}
          </div>
          <p className="text-xl max-w-3xl">
            {info.description}
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No products available in this vertical yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}