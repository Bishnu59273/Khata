-- Sample CSC services for one shop. Services now belong to a shop (see
-- migration 0002), so this must be run manually after creating a shop via
-- POST /api/auth/signup, passing that shop's id in:
--
--   psql "$DATABASE_URL" -v shop_id="'<uuid-from-signup>'" -f supabase/seed.sql
--
-- Charge/cost values are starting defaults; adjust per real portal fees.

insert into services (shop_id, name_en, name_hi, name_bn, default_charge, default_cost) values
  (:shop_id, 'Aadhar Update', 'आधार अपडेट', 'আধার আপডেট', 50, 20),
  (:shop_id, 'PAN Card', 'पैन कार्ड', 'প্যান কার্ড', 150, 107),
  (:shop_id, 'Money Transfer', 'पैसा ट्रांसफर', 'টাকা ট্রান্সফার', 30, 5),
  (:shop_id, 'Bill Payment', 'बिल भुगतान', 'বিল পেমেন্ট', 20, 0),
  (:shop_id, 'Printing', 'प्रिंटिंग', 'প্রিন্টিং', 10, 2),
  (:shop_id, 'Exam Form', 'परीक्षा फॉर्म', 'পরীক্ষার ফর্ম', 100, 60),
  (:shop_id, 'Passport', 'पासपोर्ट', 'পাসপোর্ট', 200, 150);
