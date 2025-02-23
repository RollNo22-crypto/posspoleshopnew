/*
  # Add dummy products for each vertical

  1. New Products
    - Adds 4-5 products for each vertical:
      - Health Care
      - Defense
      - Telecom
      - Future Energy
      - Agri Food
      - Mobility
      - Electronics
      - Aerospace
      - Sustainability
      - Fashion
      - Multitech
      - Manufacturing

  2. Product Details
    - Each product includes:
      - Name
      - Description
      - Price
      - Image URL (from Unsplash)
      - Features
      - Specifications
      - Stock quantity
*/

-- Clear existing products
DELETE FROM products;

-- Insert new products for each vertical
INSERT INTO products (name, description, price, vertical, image_url, specifications, features, stock, slug) VALUES
-- Health Care Products
(
  'Advanced MRI Scanner',
  'State-of-the-art magnetic resonance imaging system with AI-assisted diagnosis capabilities.',
  1500000,
  'Health Care',
  'https://images.unsplash.com/photo-1516549655169-df83a0774514',
  '{"Resolution": "Ultra HD", "Field Strength": "3 Tesla", "AI Integration": "Yes", "Patient Comfort": "Enhanced"}',
  ARRAY['AI-assisted diagnosis', 'Real-time imaging', 'Enhanced patient comfort', 'Cloud data storage'],
  5,
  'advanced-mri-scanner'
),
(
  'Surgical Robot System',
  'Precision robotic surgery system for minimally invasive procedures.',
  2000000,
  'Health Care',
  'https://images.unsplash.com/photo-1582719471384-894fbb16e074',
  '{"Precision": "Sub-millimeter", "Control": "Dual console", "Instruments": "Multiple", "3D Visualization": "Yes"}',
  ARRAY['High precision control', '3D visualization', 'Multiple instrument support', 'Ergonomic design'],
  3,
  'surgical-robot-system'
),
(
  'Patient Monitoring System',
  'Comprehensive vital signs monitoring system with wireless connectivity.',
  50000,
  'Health Care',
  'https://images.unsplash.com/photo-1583912267550-d6c2ac4b0f96',
  '{"Wireless": "Yes", "Battery Life": "24 hours", "Parameters": "15+", "Display": "Touch screen"}',
  ARRAY['Real-time monitoring', 'Wireless connectivity', 'Long battery life', 'Alert system'],
  20,
  'patient-monitoring-system'
),
(
  'Digital Pathology Scanner',
  'High-throughput digital pathology scanner with automated slide handling.',
  300000,
  'Health Care',
  'https://images.unsplash.com/photo-1579154204601-01588f351e67',
  '{"Throughput": "200 slides/hour", "Resolution": "0.25μm/pixel", "Storage": "Integrated", "Format": "Multiple"}',
  ARRAY['High throughput', 'Automated handling', 'Digital storage', 'Multiple format support'],
  8,
  'digital-pathology-scanner'
),

-- Defense Products
(
  'Tactical Drone System',
  'Advanced surveillance drone with thermal imaging and extended flight time.',
  150000,
  'Defense',
  'https://images.unsplash.com/photo-1508614589041-895b88991e3e',
  '{"Range": "10km", "Flight Time": "4 hours", "Payload": "5kg", "Sensors": "Multiple"}',
  ARRAY['Thermal imaging', 'Extended range', 'Encrypted communication', 'All-weather operation'],
  15,
  'tactical-drone-system'
),
(
  'Secure Communication System',
  'Military-grade encrypted communication system for secure operations.',
  200000,
  'Defense',
  'https://images.unsplash.com/photo-1569605803663-e9337d901ff9',
  '{"Encryption": "AES-256", "Range": "Global", "Channels": "Multiple", "Redundancy": "Triple"}',
  ARRAY['Military-grade encryption', 'Global coverage', 'Multiple channels', 'Redundant systems'],
  10,
  'secure-communication-system'
),
(
  'Armored Vehicle System',
  'Advanced protection system for military vehicles with active defense capabilities.',
  500000,
  'Defense',
  'https://images.unsplash.com/photo-1579187707643-35646d22b596',
  '{"Protection Level": "Level 4", "Weight": "Minimal", "Coverage": "360°", "Active Defense": "Yes"}',
  ARRAY['Active protection', 'Lightweight design', 'Full coverage', 'Quick installation'],
  5,
  'armored-vehicle-system'
),
(
  'Surveillance Radar',
  'Long-range surveillance radar system with advanced target tracking.',
  750000,
  'Defense',
  'https://images.unsplash.com/photo-1569605803663-e9337d901ff9',
  '{"Range": "200km", "Resolution": "High", "Tracking": "Multiple targets", "Weather": "All conditions"}',
  ARRAY['Long range detection', 'Multiple target tracking', 'All-weather operation', 'Advanced filtering'],
  7,
  'surveillance-radar'
),

-- Telecom Products
(
  '5G Base Station',
  'High-capacity 5G base station for next-generation mobile networks.',
  200000,
  'Telecom',
  'https://images.unsplash.com/photo-1516387938699-a93567ec168e',
  '{"Frequency": "Sub-6GHz & mmWave", "Capacity": "10Gbps", "Coverage": "Urban", "Power": "Efficient"}',
  ARRAY['Dual frequency support', 'High capacity', 'Urban coverage', 'Power efficient'],
  25,
  '5g-base-station'
),
(
  'Fiber Optic System',
  'Advanced fiber optic transmission system for high-speed data networks.',
  100000,
  'Telecom',
  'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6',
  '{"Speed": "100Gbps", "Distance": "100km", "Channels": "40", "Redundancy": "Yes"}',
  ARRAY['High speed', 'Long distance', 'Multiple channels', 'Redundant paths'],
  30,
  'fiber-optic-system'
),
(
  'Network Security Gateway',
  'Enterprise-grade security gateway for telecom networks.',
  150000,
  'Telecom',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31',
  '{"Throughput": "100Gbps", "Security": "Advanced", "Management": "Centralized", "Scalability": "High"}',
  ARRAY['High throughput', 'Advanced security', 'Centralized management', 'Scalable design'],
  20,
  'network-security-gateway'
),
(
  'Satellite Communication Terminal',
  'Mobile satellite communication terminal for remote connectivity.',
  75000,
  'Telecom',
  'https://images.unsplash.com/photo-1573164713988-8665fc963095',
  '{"Band": "Multi-band", "Portability": "High", "Setup": "Auto", "Power": "Low"}',
  ARRAY['Multi-band operation', 'Portable design', 'Auto setup', 'Low power consumption'],
  15,
  'satellite-communication-terminal'
),

-- Future Energy Products
(
  'Smart Grid Controller',
  'Advanced control system for smart grid management and optimization.',
  250000,
  'Future Energy',
  'https://images.unsplash.com/photo-1509390836867-55c524a0803a',
  '{"Control": "AI-based", "Integration": "Multiple sources", "Efficiency": "High", "Monitoring": "Real-time"}',
  ARRAY['AI-based control', 'Multi-source integration', 'High efficiency', 'Real-time monitoring'],
  12,
  'smart-grid-controller'
),
(
  'Solar Power System',
  'High-efficiency solar power generation and storage system.',
  180000,
  'Future Energy',
  'https://images.unsplash.com/photo-1509391366360-2e959784a276',
  '{"Efficiency": "25%", "Storage": "100kWh", "Lifespan": "25 years", "Smart": "Yes"}',
  ARRAY['High efficiency', 'Integrated storage', 'Long lifespan', 'Smart features'],
  20,
  'solar-power-system'
),
(
  'Wind Turbine System',
  'Next-generation wind turbine with advanced power generation capabilities.',
  500000,
  'Future Energy',
  'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51',
  '{"Power": "5MW", "Height": "150m", "Wind Speed": "Low start", "Grid": "Smart integration"}',
  ARRAY['High power output', 'Low wind start', 'Smart grid integration', 'Advanced monitoring'],
  8,
  'wind-turbine-system'
),
(
  'Energy Storage Unit',
  'Large-scale energy storage system for grid stabilization.',
  300000,
  'Future Energy',
  'https://images.unsplash.com/photo-1569012871812-f38ee64cd54c',
  '{"Capacity": "1MWh", "Cycles": "10000+", "Response": "Instant", "Scalable": "Yes"}',
  ARRAY['High capacity', 'Long cycle life', 'Instant response', 'Scalable design'],
  15,
  'energy-storage-unit'
),

-- Agri Food Products
(
  'Smart Farming System',
  'Integrated smart farming solution with IoT sensors and automation.',
  100000,
  'Agri Food',
  'https://images.unsplash.com/photo-1591261730799-ee4e6c2d16d7',
  '{"Sensors": "Multiple", "Control": "Automated", "Monitoring": "24/7", "AI": "Integrated"}',
  ARRAY['IoT integration', 'Automated control', 'Continuous monitoring', 'AI-based decisions'],
  25,
  'smart-farming-system'
),
(
  'Food Processing Line',
  'Automated food processing line with quality control systems.',
  400000,
  'Agri Food',
  'https://images.unsplash.com/photo-1542223189-67a03fa0f0bd',
  '{"Capacity": "2000kg/hour", "Quality": "AI monitored", "Hygiene": "Auto cleaning", "Control": "Digital"}',
  ARRAY['High capacity', 'Quality monitoring', 'Auto cleaning', 'Digital control'],
  10,
  'food-processing-line'
),
(
  'Precision Irrigation System',
  'Smart irrigation system with weather integration and water optimization.',
  75000,
  'Agri Food',
  'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0',
  '{"Coverage": "100 hectares", "Efficiency": "95%", "Control": "Smart", "Weather": "Integrated"}',
  ARRAY['Weather integration', 'Water optimization', 'Smart control', 'Large coverage'],
  30,
  'precision-irrigation-system'
),
(
  'Harvest Robot',
  'Autonomous harvesting robot with crop recognition capabilities.',
  150000,
  'Agri Food',
  'https://images.unsplash.com/photo-1591696205602-2f950c417cb9',
  '{"AI": "Crop recognition", "Speed": "Fast", "Precision": "High", "Operation": "24/7"}',
  ARRAY['Autonomous operation', 'Crop recognition', 'High precision', 'Continuous operation'],
  15,
  'harvest-robot'
),

-- Mobility Products
(
  'Electric Vehicle Charging System',
  'Fast-charging system for electric vehicles with smart grid integration.',
  80000,
  'Mobility',
  'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0',
  '{"Power": "350kW", "Charging": "Ultra-fast", "Grid": "Smart integration", "Payment": "Automated"}',
  ARRAY['Ultra-fast charging', 'Smart grid integration', 'Automated payment', 'Multiple standards'],
  40,
  'ev-charging-system'
),
(
  'Traffic Management System',
  'AI-powered traffic management system for smart cities.',
  200000,
  'Mobility',
  'https://images.unsplash.com/photo-1573648644534-2e5696e9b77d',
  '{"AI": "Deep learning", "Cameras": "HD", "Analysis": "Real-time", "Control": "Automated"}',
  ARRAY['AI-powered analysis', 'Real-time control', 'HD monitoring', 'Automated response'],
  15,
  'traffic-management-system'
),
(
  'Smart Parking Solution',
  'Automated parking management system with space detection.',
  120000,
  'Mobility',
  'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98',
  '{"Sensors": "Wireless", "Detection": "Real-time", "Payment": "Automated", "App": "Integrated"}',
  ARRAY['Space detection', 'Automated payment', 'Mobile app', 'Real-time updates'],
  25,
  'smart-parking-solution'
),
(
  'Urban Transit System',
  'Smart public transit management and tracking system.',
  300000,
  'Mobility',
  'https://images.unsplash.com/photo-1570125909232-eb263c188f7e',
  '{"Tracking": "Real-time", "Planning": "AI-optimized", "Integration": "Multi-modal", "Data": "Analytics"}',
  ARRAY['Real-time tracking', 'Route optimization', 'Multi-modal integration', 'Analytics dashboard'],
  10,
  'urban-transit-system'
),

-- Electronics Products
(
  'Industrial Control System',
  'Advanced industrial control system with IoT integration.',
  150000,
  'Electronics',
  'https://images.unsplash.com/photo-1518770660439-4636190af475',
  '{"Control": "Distributed", "IoT": "Integrated", "Interface": "Touch", "Protocol": "Multiple"}',
  ARRAY['Distributed control', 'IoT integration', 'Touch interface', 'Multi-protocol support'],
  20,
  'industrial-control-system'
),
(
  'Power Electronics Module',
  'High-efficiency power electronics module for industrial applications.',
  50000,
  'Electronics',
  'https://images.unsplash.com/photo-1555664424-778a1e5e1b48',
  '{"Efficiency": "98%", "Power": "100kW", "Cooling": "Advanced", "Protection": "Complete"}',
  ARRAY['High efficiency', 'Advanced cooling', 'Protection features', 'Modular design'],
  35,
  'power-electronics-module'
),
(
  'Sensor Array System',
  'Multi-sensor array system for industrial monitoring.',
  80000,
  'Electronics',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
  '{"Sensors": "Multiple types", "Processing": "Edge", "Network": "Wireless", "Power": "Low"}',
  ARRAY['Multiple sensor types', 'Edge processing', 'Wireless network', 'Low power operation'],
  25,
  'sensor-array-system'
),
(
  'Electronic Testing Equipment',
  'Comprehensive electronic testing and measurement system.',
  120000,
  'Electronics',
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758',
  '{"Accuracy": "High", "Range": "Wide", "Interface": "Digital", "Calibration": "Auto"}',
  ARRAY['High accuracy', 'Wide range', 'Digital interface', 'Auto calibration'],
  15,
  'electronic-testing-equipment'
),

-- Aerospace Products
(
  'Aircraft Navigation System',
  'Advanced navigation system for commercial aircraft.',
  500000,
  'Aerospace',
  'https://images.unsplash.com/photo-1517976487492-5750f3195933',
  '{"GPS": "Multi-constellation", "Backup": "Triple", "Interface": "Glass cockpit", "Updates": "Real-time"}',
  ARRAY['Multi-constellation GPS', 'Triple redundancy', 'Glass cockpit interface', 'Real-time updates'],
  8,
  'aircraft-navigation-system'
),
(
  'Satellite Communication System',
  'High-bandwidth satellite communication system for aerospace.',
  750000,
  'Aerospace',
  'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7',
  '{"Bandwidth": "High", "Coverage": "Global", "Encryption": "Military-grade", "Latency": "Low"}',
  ARRAY['High bandwidth', 'Global coverage', 'Secure communication', 'Low latency'],
  5,
  'satellite-communication-system'
),
(
  'Aircraft Engine Monitor',
  'Real-time engine monitoring and diagnostic system.',
  300000,
  'Aerospace',
  'https://images.unsplash.com/photo-1557800636-894a64c1696f',
  '{"Sensors": "Multiple", "Analysis": "Real-time", "Prediction": "AI-based", "Alert": "Immediate"}',
  ARRAY['Real-time monitoring', 'Predictive maintenance', 'Immediate alerts', 'Performance analysis'],
  12,
  'aircraft-engine-monitor'
),
(
  'Flight Control System',
  'Advanced flight control system with redundant architecture.',
  600000,
  'Aerospace',
  'https://images.unsplash.com/photo-1559627755-43a4d30e8c4d',
  '{"Control": "Triple redundant", "Response": "Real-time", "Safety": "Certified", "Integration": "Full"}',
  ARRAY['Triple redundancy', 'Real-time response', 'Safety certification', 'Full integration'],
  6,
  'flight-control-system'
),

-- Sustainability Products
(
  'Waste Management System',
  'Smart waste management system with sorting automation.',
  200000,
  'Sustainability',
  'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e',
  '{"Sorting": "Automated", "Capacity": "Large", "Recycling": "Optimized", "Monitoring": "Real-time"}',
  ARRAY['Automated sorting', 'Recycling optimization', 'Real-time monitoring', 'Waste tracking'],
  15,
  'waste-management-system'
),
(
  'Water Treatment Plant',
  'Advanced water treatment system with recycling capabilities.',
  400000,
  'Sustainability',
  'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5',
  '{"Capacity": "100000L/day", "Quality": "High", "Energy": "Efficient", "Control": "Automated"}',
  ARRAY['High capacity', 'Quality control', 'Energy efficient', 'Automated operation'],
  8,
  'water-treatment-plant'
),
(
  'Emission Control System',
  'Industrial emission control and monitoring system.',
  300000,
  'Sustainability',
  'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce',
  '{"Reduction": "95%", "Monitoring": "Continuous", "Compliance": "Automated", "Reporting": "Real-time"}',
  ARRAY['High reduction', 'Continuous monitoring', 'Compliance tracking', 'Real-time reporting'],
  12,
  'emission-control-system'
),
(
  'Renewable Energy Monitor',
  'Monitoring system for renewable energy installations.',
  150000,
  'Sustainability',
  'https://images.unsplash.com/photo-1466611653911-95081537e5b7',
  '{"Sources": "Multiple", "Analysis": "Real-time", "Optimization": "AI-based", "Integration": "Full"}',
  ARRAY['Multi-source monitoring', 'Real-time analysis', 'AI optimization', 'Full integration'],
  20,
  'renewable-energy-monitor'
),

-- Fashion Products
(
  'Smart Textile Machine',
  'Advanced textile manufacturing system with smart features.',
  250000,
  'Fashion',
  'https://images.unsplash.com/photo-1618090584126-129cd1b2d239',
  '{"Speed": "High", "Quality": "Premium", "Control": "Digital", "Materials": "Multiple"}',
  ARRAY['High speed operation', 'Quality control', 'Digital interface', 'Multi-material support'],
  10,
  'smart-textile-machine'
),
(
  'Pattern Design System',
  'Digital pattern design and optimization system.',
  100000,
  'Fashion',
  'https://images.unsplash.com/photo-1558769132-cb1aea458c5e',
  '{"Design": "3D", "Integration": "Full", "Library": "Extensive", "Output": "Multiple"}',
  ARRAY['3D design', 'Pattern optimization', 'Digital library', 'Multiple outputs'],
  15,
  'pattern-design-system'
),
(
  'Fabric Testing Equipment',
  'Comprehensive fabric testing and quality control system.',
  80000,
  'Fashion',
  'https://images.unsplash.com/photo-1558769132-cb1aea458c5e',
  '{"Tests": "Multiple", "Analysis": "Automated", "Reporting": "Digital", "Standards": "International"}',
  ARRAY['Multiple tests', 'Automated analysis', 'Digital reporting', 'Standards compliance'],
  20,
  'fabric-testing-equipment'
),
(
  'Garment Production Line',
  'Automated garment production line with quality control.',
  350000,
  'Fashion',
  'https://images.unsplash.com/photo-1558769132-cb1aea458c5e',
  '{"Production": "High speed", "Quality": "Automated check", "Flexibility": "High", "Control": "Digital"}',
  ARRAY['High speed production', 'Quality control', 'Flexible operation', 'Digital control'],
  8,
  'garment-production-line'
),

-- Multitech Products
(
  'Integration Platform',
  'Multi-technology integration platform for industrial systems.',
  200000,
  'Multitech',
  'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789',
  '{"Protocols": "Multiple", "Integration": "Universal", "Security": "Advanced", "Scale": "Enterprise"}',
  ARRAY['Universal integration', 'Protocol support', 'Security features', 'Enterprise scale'],
  15,
  'integration-platform'
),
(
  'Smart Factory System',
  'Comprehensive smart factory management system.',
  500000,
  'Multitech',
  'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789',
  '{"Control": "Centralized", "Integration": "Full", "Analytics": "Advanced", "AI": "Integrated"}',
  ARRAY['Centralized control', 'Full integration', 'Advanced analytics', 'AI capabilities'],
  8,
  'smart-factory-system'
),
(
  'IoT Gateway Platform',
  'Multi-protocol IoT gateway for industrial applications.',
  150000,
  'Multitech',
  'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789',
  '{"Protocols": "Multiple", "Processing": "Edge", "Security": "Enhanced", "Management": "Remote"}',
  ARRAY['Multi-protocol support', 'Edge processing', 'Enhanced security', 'Remote management'],
  25,
  'iot-gateway-platform'
),
(
  'Data Integration Hub',
  'Enterprise data integration and analysis platform.',
  300000,
  'Multitech',
  'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789',
  '{"Sources": "Multiple", "Processing": "Real-time", "Analytics": "Advanced", "Storage": "Scalable"}',
  ARRAY['Multi-source integration', 'Real-time processing', 'Advanced analytics', 'Scalable storage'],
  12,
  'data-integration-hub'
),

-- Manufacturing Products
(
  'Robotic Assembly Line',
  'Advanced robotic assembly system for manufacturing.',
  600000,
  'Manufacturing',
  'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122',
  '{"Robots": "Multiple", "Control": "AI", "Speed": "High", "Flexibility": "Programmable"}',
  ARRAY['Multi-robot coordination', 'AI control', 'High speed operation', 'Flexible programming'],
  6,
  'robotic-assembly-line'
),
(
  'Quality Control System',
  'Automated quality control system with machine vision.',
  250000,
  'Manufacturing',
  'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122',
  '{"Vision": "AI-based", "Speed": "Real-time", "Accuracy": "High", "Integration": "Full"}',
  ARRAY['AI vision system', 'Real-time inspection', 'High accuracy', 'Full integration'],
  15,
  'quality-control-system'
),
(
  'Production Planning System',
  'Advanced production planning and optimization system.',
  200000,
  'Manufacturing',
  'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122',
  '{"Planning": "AI-optimized", "Scheduling": "Dynamic", "Integration": "ERP", "Analytics": "Advanced"}',
  ARRAY['AI optimization', 'Dynamic scheduling', 'ERP integration', 'Advanced analytics'],
  20,
  'production-planning-system'
),
(
  'Inventory Management System',
  'Automated inventory tracking and management system.',
  150000,
  'Manufacturing',
  'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122',
  '{"Tracking": "Real-time", "Control": "Automated", "Integration": "Full", "Analytics": "Predictive"}',
  ARRAY['Real-time tracking', 'Automated control', 'Full integration', 'Predictive analytics'],
  25,
  'inventory-management-system'
);