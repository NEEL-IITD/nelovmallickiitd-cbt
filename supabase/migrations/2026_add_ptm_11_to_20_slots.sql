-- ==============================================================================
-- Migration: 2026_add_ptm_11_to_20_slots.sql
-- Description:
--   Inserts JEE Mains PTM 01 through PTM 20 slots into public.test_configs.
--   Guarantees allow_practice_after_end = TRUE so that no test is ever locked
--   after its recommended live schedule window concludes.
-- Non-destructive & Idempotent. Preserves all student records and PTA mock rows.
-- ==============================================================================

INSERT INTO public.test_configs (test_id, exam_type, code, title, status, allow_practice_after_end)
VALUES
  ('jee-mains-ptm-01', 'JEE Mains', 'PTM 01', 'JEE Mains 2027 Test Series — PTM 01', 'coming_soon', TRUE),
  ('jee-mains-ptm-02', 'JEE Mains', 'PTM 02', 'JEE Mains 2027 Test Series — PTM 02', 'coming_soon', TRUE),
  ('jee-mains-ptm-03', 'JEE Mains', 'PTM 03', 'JEE Mains 2027 Test Series — PTM 03', 'coming_soon', TRUE),
  ('jee-mains-ptm-04', 'JEE Mains', 'PTM 04', 'JEE Mains 2027 Test Series — PTM 04', 'coming_soon', TRUE),
  ('jee-mains-ptm-05', 'JEE Mains', 'PTM 05', 'JEE Mains 2027 Test Series — PTM 05', 'coming_soon', TRUE),
  ('jee-mains-ptm-06', 'JEE Mains', 'PTM 06', 'JEE Mains 2027 Test Series — PTM 06', 'coming_soon', TRUE),
  ('jee-mains-ptm-07', 'JEE Mains', 'PTM 07', 'JEE Mains 2027 Test Series — PTM 07', 'coming_soon', TRUE),
  ('jee-mains-ptm-08', 'JEE Mains', 'PTM 08', 'JEE Mains 2027 Test Series — PTM 08', 'coming_soon', TRUE),
  ('jee-mains-ptm-09', 'JEE Mains', 'PTM 09', 'JEE Mains 2027 Test Series — PTM 09', 'coming_soon', TRUE),
  ('jee-mains-ptm-10', 'JEE Mains', 'PTM 10', 'JEE Mains 2027 Test Series — PTM 10', 'coming_soon', TRUE),
  ('jee-mains-ptm-11', 'JEE Mains', 'PTM 11', 'JEE Mains 2027 Test Series — PTM 11', 'coming_soon', TRUE),
  ('jee-mains-ptm-12', 'JEE Mains', 'PTM 12', 'JEE Mains 2027 Test Series — PTM 12', 'coming_soon', TRUE),
  ('jee-mains-ptm-13', 'JEE Mains', 'PTM 13', 'JEE Mains 2027 Test Series — PTM 13', 'coming_soon', TRUE),
  ('jee-mains-ptm-14', 'JEE Mains', 'PTM 14', 'JEE Mains 2027 Test Series — PTM 14', 'coming_soon', TRUE),
  ('jee-mains-ptm-15', 'JEE Mains', 'PTM 15', 'JEE Mains 2027 Test Series — PTM 15', 'coming_soon', TRUE),
  ('jee-mains-ptm-16', 'JEE Mains', 'PTM 16', 'JEE Mains 2027 Test Series — PTM 16', 'coming_soon', TRUE),
  ('jee-mains-ptm-17', 'JEE Mains', 'PTM 17', 'JEE Mains 2027 Test Series — PTM 17', 'coming_soon', TRUE),
  ('jee-mains-ptm-18', 'JEE Mains', 'PTM 18', 'JEE Mains 2027 Test Series — PTM 18', 'coming_soon', TRUE),
  ('jee-mains-ptm-19', 'JEE Mains', 'PTM 19', 'JEE Mains 2027 Test Series — PTM 19', 'coming_soon', TRUE),
  ('jee-mains-ptm-20', 'JEE Mains', 'PTM 20', 'JEE Mains 2027 Test Series — PTM 20', 'coming_soon', TRUE)
ON CONFLICT (test_id) DO UPDATE SET
  allow_practice_after_end = TRUE;
