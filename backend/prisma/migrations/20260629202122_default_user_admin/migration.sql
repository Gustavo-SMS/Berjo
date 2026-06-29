-- MySQL migration

START TRANSACTION;

INSERT INTO customers (
  id,
  name,
  email,
  docNumber,
  phone,
  debt,
  created_at,
  isActive
)
VALUES (
  1,
  'Admin',
  'admin@email.com',
  '12345678900',
  '48999999999',
  0,
  NOW(),
  TRUE
);

INSERT INTO address (
  street,
  house_number,
  complement,
  city,
  district,
  state,
  zip,
  customer_id
)
VALUES (
  'Rua das Flores',
  123,
  'Apto 201',
  'Palhoça',
  'Centro',
  'SC',
  '88130000',
  1
);

INSERT INTO `User` (
  id,
  login,
  password,
  role,
  isActive,
  mustChangePassword,
  customerId
)
VALUES (
  1,
  'admin',
  '$2b$12$DKi7LXp8Pg712mElVzJGQufCM/0sbpFamdfi.vSWlzzqBvV9LrR3u',
  'ADMIN',
  TRUE,
  FALSE,
  1
);

COMMIT;