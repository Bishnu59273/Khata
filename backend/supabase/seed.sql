-- Sample CSC services, matching the shop's actual offerings.
-- Charge/cost values are starting defaults; adjust per real portal fees.

insert into services (name_en, name_hi, name_bn, default_charge, default_cost) values
  ('Aadhar Update', 'आधार अपडेट', 'আধার আপডেট', 50, 20),
  ('PAN Card', 'पैन कार्ड', 'প্যান কার্ড', 150, 107),
  ('Money Transfer', 'पैसा ट्रांसफर', 'টাকা ট্রান্সফার', 30, 5),
  ('Bill Payment', 'बिल भुगतान', 'বিল পেমেন্ট', 20, 0),
  ('Printing', 'प्रिंटिंग', 'প্রিন্টিং', 10, 2),
  ('Exam Form', 'परीक्षा फॉर्म', 'পরীক্ষার ফর্ম', 100, 60),
  ('Passport', 'पासपोर्ट', 'পাসপোর্ট', 200, 150);
