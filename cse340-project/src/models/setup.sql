-- Create organization table
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- Insert sample organizations
INSERT INTO organization
    (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders',
 'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
 'info@brightfuturebuilders.org',
 'brightfuture-logo.png'),

('GreenHarvest Growers',
 'An urban farming collective promoting food sustainability and education in local neighborhoods.',
 'contact@greenharvest.org',
 'greenharvest-logo.png'),

('UnityServe Volunteers',
 'A volunteer coordination group supporting local charities and service initiatives.',
 'hello@unityserve.org',
 'unityserve-logo.png');

 CREATE TABLE service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organization(organization_id),
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(200) NOT NULL,
    date DATE NOT NULL
);

INSERT INTO service_project
(organization_id, title, description, location, date)
VALUES
(1, 'Community Park Renovation', 'Renovating a local park and improving public spaces.', 'Paramaribo', '2026-11-15'),
(1, 'School Repairs', 'Repairing classrooms and improving school facilities.', 'Lelydorp', '2026-11-20'),
(1, 'Community Center Cleanup', 'Cleaning and improving a neighborhood community center.', 'Paramaribo', '2026-11-25'),
(1, 'Safe Playground Project', 'Building a safer playground for local children.', 'Wanica', '2026-12-01'),
(1, 'Neighborhood Road Improvement', 'Improving roads and pathways in the community.', 'Commewijne', '2026-12-05'),
(2, 'Community Garden Day', 'Creating a shared garden for local residents.', 'Paramaribo', '2026-11-16'),
(2, 'Tree Planting Initiative', 'Planting trees to support a greener environment.', 'Lelydorp', '2026-11-21'),
(2, 'Urban Farming Workshop', 'Teaching residents how to grow their own food.', 'Wanica', '2026-11-26'),
(2, 'School Vegetable Garden', 'Establishing a vegetable garden at a local school.', 'Paramaribo', '2026-12-02'),
(2, 'Food Sustainability Fair', 'Promoting sustainable food production and healthy eating.', 'Commewijne', '2026-12-06'),
(3, 'Food Donation Drive', 'Collecting and distributing food to families in need.', 'Paramaribo', '2026-11-17'),
(3, 'Senior Citizen Support', 'Providing assistance and companionship to elderly residents.', 'Lelydorp', '2026-11-22'),
(3, 'Neighborhood Cleanup', 'Organizing volunteers to clean public areas.', 'Wanica', '2026-11-27'),
(3, 'Clothing Donation Campaign', 'Collecting clothes for families in need.', 'Paramaribo', '2026-12-03'),
(3, 'Community Volunteer Day', 'Bringing volunteers together for local service activities.', 'Commewijne', '2026-12-07');