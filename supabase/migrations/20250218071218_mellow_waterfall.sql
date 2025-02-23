/*
  # Update products table and add dummy data
  
  1. Table Changes
    - Add specifications (JSONB)
    - Add features (text array)
    - Add rating (numeric)
    - Add reviews_count (integer)
    - Add slug (text)
    - Add stock (integer)
  
  2. Data
    - Add dummy products for each vertical
    - Include realistic specifications and features
*/

-- Add new columns to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS specifications JSONB;
ALTER TABLE products ADD COLUMN IF NOT EXISTS features TEXT[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS rating NUMERIC DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS reviews_count INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;

-- Add dummy products
INSERT INTO products (name, description, price, vertical, image_url, specifications, features, rating, reviews_count, slug, stock)
VALUES
  -- Fashion Vertical
  (
    'Industrial Safety Suit',
    'High-performance safety suit designed for industrial environments. Features flame-resistant material and enhanced visibility.',
    299.99,
    'Fashion',
    'https://images.unsplash.com/photo-1618090584126-129cd1b2d239',
    '{"Material": "Flame-resistant cotton", "Size": "S-XXL", "Color": "High-vis yellow", "Certification": "ISO 11612"}',
    ARRAY['Flame resistant', 'High visibility', 'Breathable', 'Multiple pockets'],
    4.5,
    12,
    'industrial-safety-suit',
    50
  ),
  (
    'Heavy Duty Work Boots',
    'Steel-toed work boots with slip-resistant soles and waterproof construction.',
    189.99,
    'Fashion',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    '{"Material": "Full-grain leather", "Safety": "Steel toe", "Sole": "Rubber", "Waterproof": "Yes"}',
    ARRAY['Steel toe protection', 'Slip resistant', 'Waterproof', 'Shock absorbing'],
    4.8,
    24,
    'heavy-duty-work-boots',
    75
  ),

  -- Food Vertical
  (
    'Industrial Mixer',
    'Commercial-grade mixer for large-scale food production with variable speed control.',
    2499.99,
    'Food',
    'https://images.unsplash.com/photo-1591261730799-ee4e6c2d16d7',
    '{"Capacity": "50L", "Power": "1500W", "Speed": "Variable", "Material": "Stainless Steel"}',
    ARRAY['Variable speed', 'Digital controls', 'Safety lock', 'Easy clean'],
    4.7,
    18,
    'industrial-mixer',
    10
  ),
  (
    'Vacuum Sealer',
    'Professional vacuum sealing system for food packaging and preservation.',
    899.99,
    'Food',
    'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d',
    '{"Sealing Length": "50cm", "Pump": "Dual pump", "Material": "Stainless Steel", "Voltage": "220V"}',
    ARRAY['Double sealing', 'Digital display', 'Multiple modes', 'Heavy duty'],
    4.6,
    15,
    'vacuum-sealer',
    20
  ),

  -- Defense Vertical
  (
    'Tactical Drone System',
    'Advanced surveillance drone with thermal imaging and extended flight time.',
    4999.99,
    'Defense',
    'https://images.unsplash.com/photo-1508614589041-895b88991e3e',
    '{"Range": "5km", "Flight Time": "45min", "Camera": "4K + Thermal", "Control": "Encrypted"}',
    ARRAY['Thermal imaging', 'Encrypted control', 'Long range', 'Weather resistant'],
    4.9,
    8,
    'tactical-drone-system',
    5
  ),
  (
    'Ballistic Shield',
    'Lightweight ballistic shield with Level IIIA protection and ergonomic handle.',
    1299.99,
    'Defense',
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713',
    '{"Protection": "Level IIIA", "Weight": "12kg", "Material": "Composite", "Coverage": "Full body"}',
    ARRAY['Level IIIA protection', 'Ergonomic handle', 'Lightweight', 'Durable'],
    4.7,
    11,
    'ballistic-shield',
    15
  ),

  -- Energy Vertical
  (
    'Solar Panel Array',
    'High-efficiency solar panel system with smart monitoring capabilities.',
    3499.99,
    'Energy',
    'https://images.unsplash.com/photo-1509391366360-2e959784a276',
    '{"Power": "400W", "Efficiency": "21%", "Warranty": "25 years", "Type": "Monocrystalline"}',
    ARRAY['High efficiency', 'Smart monitoring', 'Weather resistant', 'Long warranty'],
    4.8,
    22,
    'solar-panel-array',
    30
  ),
  (
    'Wind Turbine Generator',
    'Compact wind turbine generator for industrial and commercial applications.',
    5999.99,
    'Energy',
    'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51',
    '{"Power": "5kW", "Cut-in Speed": "3m/s", "Height": "12m", "Blade Material": "Carbon fiber"}',
    ARRAY['Low noise', 'High output', 'Remote monitoring', 'Easy installation'],
    4.6,
    14,
    'wind-turbine-generator',
    8
  ),

  -- Marine Vertical
  (
    'Marine Navigation System',
    'Advanced GPS navigation system with radar integration for commercial vessels.',
    7999.99,
    'Marine',
    'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0',
    '{"Display": "15 inch", "GPS": "Multi-constellation", "Radar": "4kW", "Waterproof": "IPX7"}',
    ARRAY['Radar integration', 'Weather overlay', 'Route planning', 'AIS compatible'],
    4.9,
    16,
    'marine-navigation-system',
    12
  ),
  (
    'Underwater ROV',
    'Professional underwater ROV with 4K camera and manipulator arm.',
    12999.99,
    'Marine',
    'https://images.unsplash.com/photo-1532619187608-e5375cab36aa',
    '{"Depth": "300m", "Camera": "4K", "Thrusters": "6", "Battery": "4 hours"}',
    ARRAY['4K camera', 'Manipulator arm', 'Deep dive', 'Long battery'],
    4.8,
    9,
    'underwater-rov',
    5
  ),

  -- Heavy Industries Vertical
  (
    'Industrial Crane System',
    'Heavy-duty overhead crane system with advanced safety features.',
    24999.99,
    'Heavy Industries',
    'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122',
    '{"Capacity": "20 tons", "Span": "30m", "Height": "12m", "Control": "Remote"}',
    ARRAY['Remote control', 'Safety locks', 'Load monitoring', 'Anti-sway'],
    4.7,
    7,
    'industrial-crane-system',
    3
  ),
  (
    'CNC Machining Center',
    '5-axis CNC machining center for precision manufacturing.',
    89999.99,
    'Heavy Industries',
    'https://images.unsplash.com/photo-1565439322755-7c6e26210d27',
    '{"Axes": "5", "Travel": "1000mm", "Spindle": "15000rpm", "Accuracy": "±0.005mm"}',
    ARRAY['5-axis control', 'Tool changer', 'Cooling system', 'Safety enclosure'],
    4.9,
    11,
    'cnc-machining-center',
    2
  ),

  -- Health Vertical
  (
    'Medical Imaging System',
    'Advanced medical imaging system with AI-assisted diagnosis.',
    149999.99,
    'Health',
    'https://images.unsplash.com/photo-1516549655169-df83a0774514',
    '{"Resolution": "4K", "AI": "Integrated", "Storage": "10TB", "Certification": "FDA"}',
    ARRAY['AI diagnosis', 'Cloud storage', 'Multi-modality', 'Touch screen'],
    4.8,
    13,
    'medical-imaging-system',
    4
  ),
  (
    'Sterilization Unit',
    'Hospital-grade sterilization unit with digital controls.',
    8999.99,
    'Health',
    'https://images.unsplash.com/photo-1581093458791-9d58946cc6cc',
    '{"Capacity": "200L", "Temperature": "180°C", "Cycles": "Multiple", "Display": "Digital"}',
    ARRAY['Multiple cycles', 'Digital control', 'Safety locks', 'Validation'],
    4.7,
    19,
    'sterilization-unit',
    15
  ),

  -- Miscellaneous Vertical
  (
    'Industrial 3D Printer',
    'Large-format industrial 3D printer for manufacturing and prototyping.',
    19999.99,
    'Miscellaneous',
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789',
    '{"Build Volume": "500x500x500mm", "Resolution": "0.05mm", "Materials": "Multiple", "Software": "Included"}',
    ARRAY['Large format', 'Multi-material', 'Network control', 'Heated chamber'],
    4.8,
    17,
    'industrial-3d-printer',
    8
  ),
  (
    'Automated Warehouse Robot',
    'Intelligent warehouse robot with autonomous navigation and picking capabilities.',
    34999.99,
    'Miscellaneous',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    '{"Payload": "500kg", "Battery": "8 hours", "Navigation": "Autonomous", "Sensors": "Multiple"}',
    ARRAY['Autonomous navigation', 'Object recognition', 'Fleet management', 'Safety sensors'],
    4.9,
    12,
    'automated-warehouse-robot',
    6
  );