-- ISSUE-022: Add NOT NULL constraint to prds.user_id (prevents RLS bypass)
-- First clean up any orphan rows (shouldn't exist, but safety first)
DELETE FROM public.prds WHERE user_id IS NULL;

-- Now add the constraint
ALTER TABLE public.prds ALTER COLUMN user_id SET NOT NULL;

-- ISSUE-021: Add missing index on prd_versions.prd_id for query performance
CREATE INDEX IF NOT EXISTS idx_prd_versions_prd_id ON public.prd_versions(prd_id);

-- ISSUE-028: Add a check constraint to limit versions per PRD (soft cap at 50)
-- Note: This is enforced via application logic, not a DB constraint,
-- because PostgreSQL doesn't support CHECK constraints referencing other rows.
-- The application will check version count before inserting.
