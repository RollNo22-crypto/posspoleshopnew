import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Shield,
  Phone,
  Zap,
  Wheat,
  Car,
  Cpu,
  Plane,
  Leaf,
  Shirt,
  Boxes,
  Factory,
  ChevronRight
} from 'lucide-react';

const verticals = [
  {
    category: "Healthcare & Defense",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514",
    items: [
      {
        title: "Health Care",
        icon: Heart,
        subCategories: [
          "Medical Equipment",
          "Diagnostic Devices",
          "Healthcare Solutions",
          "Patient Care"
        ],
        link: "/verticals/Health Care"
      },
      {
        title: "Defense",
        icon: Shield,
        subCategories: [
          "Security Systems",
          "Defense Equipment",
          "Tactical Solutions",
          "Protection Gear"
        ],
        link: "/verticals/Defense"
      }
    ]
  },
  {
    category: "Technology & Energy",
    image: "https://images.unsplash.com/photo-1516387938699-a93567ec168e",
    items: [
      {
        title: "Telecom",
        icon: Phone,
        subCategories: [
          "Network Infrastructure",
          "Communication Systems",
          "Wireless Solutions",
          "Data Centers"
        ],
        link: "/verticals/Telecom"
      },
      {
        title: "Future Energy",
        icon: Zap,
        subCategories: [
          "Renewable Energy",
          "Smart Grids",
          "Energy Storage",
          "Clean Tech"
        ],
        link: "/verticals/Future Energy"
      }
    ]
  },
  {
    category: "Food & Mobility",
    image: "https://images.unsplash.com/photo-1591261730799-ee4e6c2d16d7",
    items: [
      {
        title: "Agri Food",
        icon: Wheat,
        subCategories: [
          "Farm Technology",
          "Food Processing",
          "Smart Agriculture",
          "Sustainable Solutions"
        ],
        link: "/verticals/Agri Food"
      },
      {
        title: "Mobility",
        icon: Car,
        subCategories: [
          "Electric Vehicles",
          "Smart Transport",
          "Urban Mobility",
          "Charging Infrastructure"
        ],
        link: "/verticals/Mobility"
      }
    ]
  },
  {
    category: "Electronics & Aerospace",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    items: [
      {
        title: "Electronics",
        icon: Cpu,
        subCategories: [
          "Circuit Systems",
          "Electronic Components",
          "Smart Devices",
          "Control Systems"
        ],
        link: "/verticals/Electronics"
      },
      {
        title: "Aerospace",
        icon: Plane,
        subCategories: [
          "Aircraft Systems",
          "Space Technology",
          "Aviation Equipment",
          "Aerospace Components"
        ],
        link: "/verticals/Aerospace"
      }
    ]
  },
  {
    category: "Sustainability & Fashion",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e",
    items: [
      {
        title: "Sustainability",
        icon: Leaf,
        subCategories: [
          "Green Technology",
          "Waste Management",
          "Eco Solutions",
          "Sustainable Materials"
        ],
        link: "/verticals/Sustainability"
      },
      {
        title: "Fashion",
        icon: Shirt,
        subCategories: [
          "Textile Tech",
          "Smart Fabrics",
          "Manufacturing",
          "Design Solutions"
        ],
        link: "/verticals/Fashion"
      }
    ]
  },
  {
    category: "Multi-Technology & Manufacturing",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789",
    items: [
      {
        title: "Multitech",
        icon: Boxes,
        subCategories: [
          "Integrated Systems",
          "Multi-platform Solutions",
          "Tech Integration",
          "Smart Systems"
        ],
        link: "/verticals/Multitech"
      },
      {
        title: "Manufacturing",
        icon: Factory,
        subCategories: [
          "Smart Factory",
          "Industrial Automation",
          "Production Systems",
          "Quality Control"
        ],
        link: "/verticals/Manufacturing"
      }
    ]
  }
];

export default function VerticalsOverview() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Industry Verticals</h1>
        
        <div className="space-y-8">
          {verticals.map((section, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3">
                {/* Left Image Section */}
                <div className="relative h-full">
                  <img
                    src={section.image}
                    alt={section.category}
                    className="w-full h-full object-cover"
                    style={{ minHeight: '300px' }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <h2 className="text-white text-2xl font-bold text-center px-4">
                      {section.category}
                    </h2>
                  </div>
                </div>

                {/* Right Content Section */}
                <div className="md:col-span-2 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {section.items.map((item, itemIdx) => {
                      const Icon = item.icon;
                      return (
                        <div key={itemIdx} className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                              <Icon className="w-6 h-6 text-cyan-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">
                              {item.title}
                            </h3>
                          </div>
                          
                          <ul className="space-y-2">
                            {item.subCategories.map((sub, subIdx) => (
                              <li key={subIdx} className="text-gray-600">
                                {sub}
                              </li>
                            ))}
                          </ul>
                          
                          <Link
                            to={item.link}
                            className="inline-flex items-center text-cyan-600 hover:text-cyan-700 font-medium"
                          >
                            View More
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}