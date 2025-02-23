import React from 'react';
import { Link } from 'react-router-dom';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  title: string;
  icon: LucideIcon;
  description: string;
  link: string;
}

export default function CategoryCard({ title, icon: Icon, description, link }: CategoryCardProps) {
  return (
    <Link
      to={link}
      className="block group bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      <div className="p-6">
        <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-200 transition-colors">
          <Icon className="w-6 h-6 text-cyan-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
}